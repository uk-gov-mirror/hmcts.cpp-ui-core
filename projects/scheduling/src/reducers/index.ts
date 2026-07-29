import { Action } from '@ngrx/store';
import { scheduling, SchedulingState as SchedulingFeatureState } from './scheduling';

export interface SchedulingState {
  scheduling: SchedulingFeatureState;
}

export function schedulingReducer(state: SchedulingFeatureState | undefined, action: Action) {
  return scheduling(state, action);
}
