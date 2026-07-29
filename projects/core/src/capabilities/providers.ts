import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CAPABILITIES_CONFIG, CapabilitiesConfig, CapabilitiesService } from './service';
import { CapabilityRestrictedGuard } from './guards';

export const provideCppCapabilities = (config: CapabilitiesConfig): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: CAPABILITIES_CONFIG, useValue: config },
    CapabilityRestrictedGuard,
    CapabilitiesService
  ]);
};
