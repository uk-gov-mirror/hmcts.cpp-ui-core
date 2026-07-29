import { AllocationsFormConfig } from '../types';
import { InjectionToken } from '@angular/core';

export const ALLOCATION_FORM_CONFIGS = new InjectionToken<Record<string, AllocationsFormConfig>>(
  'AllocationFormConfigs'
);

export const allocationFormConfigs: Record<string, AllocationsFormConfig> = {
  showHearingType: {
    formFields: ['hearingType']
  },
  showNotification: {
    formFields: ['sendNotificationToParties']
  },
  showHearingTypeAndNotification: {
    formFields: ['hearingType', 'sendNotificationToParties']
  }
};
