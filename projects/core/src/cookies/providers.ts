import { EnvironmentProviders, makeEnvironmentProviders, NgModule } from '@angular/core';
import { DynatraceRealUserMonitoringMock } from './dynatrace/dtrum.mock';
import { DynatraceService } from './dynatrace/dynatrace.service';
import { CookiesService } from './cookies.service';

export function createDynatraceService() {
  const dtrum = window.dtrum || new DynatraceRealUserMonitoringMock();

  return new DynatraceService(dtrum);
}

export const provideCppCookieServices = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    CookiesService,
    {
      provide: DynatraceService,
      useFactory: createDynatraceService
    }
  ]);
};
