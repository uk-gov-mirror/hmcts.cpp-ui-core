import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { NotificationDispatcher } from './dispatcher';
import { CppHttpBackend, CppHttpConfig, HTTP_CONFIG } from './http-backend';
import {
  detectNetwork,
  DETECT_NETWORK,
  generateUniqueKey,
  GENERATE_UNIQUE_KEY,
  DetectNetworkFn
} from './util';
import { CppHttp } from './http-service';

export interface CppHttpConfigKind {
  new (...args: any[]): CppHttpConfig;
}

/**
 *
 * @param cppHttpConfig - The config class that implements the baseURl - Please Note: This must be an injectable class already provided
 * @param cppHttp - The service to override the original cppHttp service
 * @param networkDetector - a function that overrides the original detect network function
 * @returns
 */
export function withCppHttpOverrides(
  cppHttpConfig: CppHttpConfigKind,
  cppHttp?: typeof CppHttp,
  networkDetector?: DetectNetworkFn
): Provider[] {
  const providers: Provider[] = [
    {
      provide: HTTP_CONFIG,
      useExisting: cppHttpConfig
    }
  ];

  if (!!cppHttp) {
    providers.push({
      provide: CppHttp,
      useClass: cppHttp
    });
  }

  if (!!networkDetector) {
    providers.push({
      provide: DETECT_NETWORK,
      useValue: networkDetector
    });
  }
  return providers;
}
/**
 * When providing interceptors, ensure your interceptor functions are placed in the order you want them chained
 */
export const provideCppCoreHttpServices = (
  overrideProviders: Provider[] = [],
  ...interceptorFns: HttpInterceptorFn[]
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: DETECT_NETWORK,
      useValue: detectNetwork
    },
    {
      provide: GENERATE_UNIQUE_KEY,
      useValue: generateUniqueKey
    },
    {
      provide: HTTP_CONFIG,
      useValue: { baseUrl: '/' }
    },
    provideHttpClient(withInterceptorsFromDi(), withInterceptors(interceptorFns)),
    CppHttpBackend,
    NotificationDispatcher,
    CppHttp,
    ...overrideProviders
  ]);
};
