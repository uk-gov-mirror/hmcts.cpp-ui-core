import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InjectionToken, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { SessionInterceptor } from './interceptor';
import { FakeSessionService, INITIAL_USER_ID } from './service';

export interface FakeSessionModuleOptions {
  defaultUserId?: string;
  queryParamInitializer?: boolean;
}

export const FAKE_SESSION_OPTIONS = new InjectionToken<FakeSessionModuleOptions>(
  'FAKE_SESSION_OPTIONS'
);

export function getInitialUserId(options: FakeSessionModuleOptions) {
  const searchParams = new URLSearchParams(window.location.search);
  return (
    (options.queryParamInitializer && searchParams.get('CJSCPPUID')) ||
    (options.defaultUserId as string)
  );
}

export const provideCppFakeSession = (
  options: FakeSessionModuleOptions = { queryParamInitializer: true }
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: FAKE_SESSION_OPTIONS,
      useValue: options
    },
    {
      provide: INITIAL_USER_ID,
      useFactory: getInitialUserId,
      deps: [FAKE_SESSION_OPTIONS]
    },
    {
      provide: FakeSessionService,
      useClass: FakeSessionService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptor,
      multi: true
    }
  ]);
};
