import { createAction, props } from '@ngrx/store';
import { HearingSlot, SearchHearingSlotsParams } from '../types';

export const loadHearingSlotsSuccess = createAction(
  'LOAD_SCHEDULING_SLOTS_SUCCESS',
  props<{
    params: SearchHearingSlotsParams;
    hearingSlots: HearingSlot[];
    totalResults: number;
  }>()
);

export const resetHearingSlots = createAction('RESET_SCHEDULING_SLOTS');
