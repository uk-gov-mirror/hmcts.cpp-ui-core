import { InjectionToken } from '@angular/core';
import { distinctUntilChanged, fromEvent, map, merge, Observable, of, startWith } from 'rxjs';
import uuid from 'uuid/v4';
import { HttpParams } from '@angular/common/http';

export type GenerateUniqueKeyFn = () => string;
export type DetectNetworkFn = () => Observable<boolean>;

export const DETECT_NETWORK = new InjectionToken<DetectNetworkFn>('DETECT_NETWORK');
export const GENERATE_UNIQUE_KEY = new InjectionToken<GenerateUniqueKeyFn>('GENERATE_UNIQUE_KEY');

export const detectNetwork: DetectNetworkFn = (): Observable<boolean> => {
  return merge(
    fromEvent(window, 'online').pipe(map(() => true)),
    fromEvent(window, 'offline').pipe(map(() => false))
  ).pipe(startWith(navigator.onLine), distinctUntilChanged());
};

export const filterExists = <T extends object>(payload: T) =>
  Object.keys(payload)
    .filter((key) => payload[key as keyof T] !== undefined)
    .reduce(
      (body, key) => ({
        ...body,
        [key]: payload[key as keyof T]
      }),
      {} as T
    );

export const generateUniqueKey: GenerateUniqueKeyFn = () => uuid();

export const mapObjectToHttpParams = (params: { [key: string]: any }) =>
  new HttpParams({
    fromObject: Object.keys(params)
      .filter((key) => params[key] !== undefined)
      .reduce(
        (queryParams, key) => ({
          ...queryParams,
          [key]: String(params[key])
        }),
        {} as { [key: string]: string }
      )
  });
