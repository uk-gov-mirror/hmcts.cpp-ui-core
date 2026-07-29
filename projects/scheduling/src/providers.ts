import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { schedulingReducer } from './reducers';
import { ALLOCATION_FORM_CONFIGS, allocationFormConfigs } from './utils';

export const provideSchedulingstore = (): EnvironmentProviders => {
  return provideState({ name: 'scheduling', reducer: schedulingReducer });
};

export const provideSchedulingEnvironmentContext = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: ALLOCATION_FORM_CONFIGS,
      useValue: allocationFormConfigs
    },
    provideSchedulingstore()
  ]);
};
