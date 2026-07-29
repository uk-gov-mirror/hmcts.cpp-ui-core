import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  mergeMap,
  publishReplay,
  refCount,
  retryWhen,
  switchMap,
  tap
} from 'rxjs/operators';
import { CppHttpBackend } from './http-backend';
import { GENERATE_UNIQUE_KEY } from './util';

export type NotificationEvent<T extends object = Record<string, unknown>> = {
  _metadata: {
    id: string;
    name: string;
    correlation?: {
      client: string;
    };
  };
} & T;

@Injectable()
export class NotificationDispatcher {
  // Create a subscription to the notifications server the very first time that
  // the poller connects. This subscription id remains valid for the lifecycle of
  // the application, and can be reused even after refCount has dropped to 0
  subscription$ = of(this.generateUniqueKey()).pipe(
    switchMap((subscriptionId) =>
      this.backend
        .post(
          `/notification-command-api/command/api/rest/notification/subscriptions/${subscriptionId}`,
          'application/vnd.notification.subscribe-by-user-id+json'
        )
        .pipe(mapTo(subscriptionId))
    ),
    publishReplay(1),
    refCount()
  );

  constructor(
    @Inject(GENERATE_UNIQUE_KEY) private generateUniqueKey: any,
    private readonly backend: CppHttpBackend
  ) {}

  getEvents<T extends object = Record<string, unknown>>(params?: {
    clientCorrelationId: string;
  }): Observable<NotificationEvent<T>> {
    const history = [] as string[];

    return this.subscription$.pipe(
      switchMap((subscriptionId) =>
        timer(0, 1500).pipe(
          exhaustMap(() =>
            this.backend.get<{ events: NotificationEvent<T>[] }>(
              `/notification-query-api/query/api/rest/notifications/subscriptions/${subscriptionId}/events`,
              'application/vnd.notification.events+json',
              { params: new HttpParams({ fromObject: params }) }
            )
          ),
          map((data) => data.events),
          mergeMap((events) => events),
          // Filter any events that have been seen before so that they're not re-emitted
          // to any subscribers.
          filter((event) => history.indexOf(event._metadata.id) === -1),
          tap((event) => {
            history.push(event._metadata.id);
          }),
          retryWhen((errors) =>
            errors.pipe(
              switchMap((error: HttpErrorResponse) => {
                // events will sometimes return 403 for reasons unknown
                if (error.status === 403) {
                  return timer(1500);
                }
                return throwError(error);
              })
            )
          )
        )
      )
    );
  }
}
