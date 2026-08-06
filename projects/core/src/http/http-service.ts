import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { merge, Observable, race, throwError, timer } from 'rxjs';
import { catchError, filter, map, share, switchMap, take } from 'rxjs/operators';
import { NotificationDispatcher, NotificationEvent } from './dispatcher';
import { CppHttpBackend, GetRequestOptions, PostRequestOptions } from './http-backend';
import { GenerateUniqueKeyFn, GENERATE_UNIQUE_KEY } from './util';

const CORRELATION_KEY = 'CPPCLIENTCORRELATIONID';
const empty = [] as string[];

export interface HttpQueryOptions extends GetRequestOptions {
  url: string;
  requestType: string;
  background?: boolean;
}

interface HttpCommandBaseOptions extends PostRequestOptions {
  url: string;
  body?: any;
  requestType?: string;
}

interface JsonCommandRequestOptions extends HttpCommandBaseOptions {
  requestType: string;
}

interface FormDataCommandOptions extends HttpCommandBaseOptions {
  body: FormData;
}

export type HttpComandOptions = JsonCommandRequestOptions | FormDataCommandOptions;

interface HttpCommandSyncBaseOptions extends HttpCommandBaseOptions {
  successEvent: string;
  timeout?: number;
  errorEvent?: string | string[];
}

interface JsonCommandSyncOptions extends HttpCommandSyncBaseOptions {
  requestType: string;
}

interface PostCommandSyncOptions extends HttpCommandSyncBaseOptions {
  body: FormData;
}

export type HttpCommandSyncOptions = JsonCommandSyncOptions | PostCommandSyncOptions;

export interface CommandError<T extends Record<string, unknown> = Record<string, unknown>> {
  status: -1;
  clientCorrelationId: string;
  originalEvent: NotificationEvent<T>;
  data: T;
}

@Injectable()
export class CppHttp {
  constructor(
    @Inject(GENERATE_UNIQUE_KEY) private generateUniqueKey: GenerateUniqueKeyFn,
    private http: CppHttpBackend,
    private notificationDispatcher: NotificationDispatcher
  ) {}

  query<R>({ url, requestType, ...options }: HttpQueryOptions): Observable<R> {
    const clientCorrelationId = this.setCorrelationId(options);

    return this.http
      .get<R>(url, requestType, options)
      .pipe(catchError((error) => throwError(this.tagError(error, clientCorrelationId))));
  }

  command({ url, requestType, body, ...options }: HttpComandOptions): Observable<any> {
    const clientCorrelationId = this.setCorrelationId(options);

    return this.http
      .post(url, requestType, body, options)
      .pipe(catchError((error) => throwError(this.tagError(error, clientCorrelationId))));
  }

  commandSync<R extends object = Record<string, unknown>>({
    successEvent,
    errorEvent,
    timeout,
    ...options
  }: HttpCommandSyncOptions): Observable<R> {
    const clientCorrelationId = this.generateUniqueKey();
    const errorNames = empty.concat(errorEvent || []);

    options.headers = options.headers || new HttpHeaders();
    options.headers = options.headers.set(CORRELATION_KEY, clientCorrelationId);

    return merge(
      timer(timeout || 30000).pipe(switchMap(() => throwError({ status: 0, clientCorrelationId }))),
      this.command(options).pipe(
        switchMap(() => {
          const events$ = this.notificationDispatcher
            .getEvents<R>({ clientCorrelationId })
            .pipe(share());

          const success$ = events$.pipe(
            filter((event) => event._metadata.name === successEvent),
            map(({ _metadata, ...data }) => data as unknown as R),
            take(1)
          );

          const error$ = events$.pipe(
            filter((event) => errorNames.indexOf(event._metadata.name) !== -1),
            switchMap((event) => {
              const { _metadata, ...data } = event;

              return throwError({
                clientCorrelationId,
                data,
                originalEvent: event,
                status: -1
              });
            })
          );

          return race(success$, error$);
        })
      )
    ).pipe(take(1));
  }

  // fill-if-absent: commandSync (or any caller supplying its own id) must keep
  // the id it races the notification events on
  private setCorrelationId(options: { headers?: HttpHeaders }): string {
    options.headers = options.headers || new HttpHeaders();
    if (!options.headers.has(CORRELATION_KEY)) {
      options.headers = options.headers.set(CORRELATION_KEY, this.generateUniqueKey());
    }
    return options.headers.get(CORRELATION_KEY) as string;
  }

  private tagError(error: unknown, clientCorrelationId: string): unknown {
    if (error && typeof error === 'object' && !('clientCorrelationId' in error)) {
      (error as Record<string, unknown>).clientCorrelationId = clientCorrelationId;
    }
    return error;
  }
}
