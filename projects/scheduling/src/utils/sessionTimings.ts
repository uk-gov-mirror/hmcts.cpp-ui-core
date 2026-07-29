import { HearingSlot } from '../types';

export const CUSTOM_SESSION_TIME_LIMITS: Record<
  HearingSlot['courtSession'],
  { min: string; max: string }
> = {
  AM: { min: '01:00', max: '13:00' },
  PM: { min: '14:00', max: '23:00' },
  AD: { min: '01:00', max: '23:00' }
} as const;

export const NATIONAL_STANDARD_TIMES: Record<
  HearingSlot['courtSession'],
  { sessionStartTime: string; sessionEndTime: string }
> = {
  AM: { sessionStartTime: '10:00', sessionEndTime: '13:00' },
  PM: { sessionStartTime: '14:00', sessionEndTime: '17:00' },
  AD: { sessionStartTime: '10:00', sessionEndTime: '17:00' }
} as const;
