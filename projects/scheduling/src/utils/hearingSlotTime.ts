import { HearingSlot } from '../types';
import { SelectOption } from '@cpp/pdk';
import { CUSTOM_SESSION_TIME_LIMITS } from './sessionTimings';

type SelectTimeOption = SelectOption<string> & { count: number };

/**
 * Converts hours and minutes to a 12-hour formatted time string with am/pm.
 */
const formatHoursMinutes = (hours: number, minutes: number): string => {
  const isPM = hours >= 12;
  const formattedHour = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMinutes}${isPM ? 'pm' : 'am'}`;
};

/**
 * Formats a "HH:mm" time string to 12-hour time.
 */
const formatTimeString = (timeStr: string): string => {
  const [hhStr, mmStr] = timeStr.split(':');
  const hours = parseInt(hhStr, 10);
  const minutes = parseInt(mmStr, 10);
  return formatHoursMinutes(hours, minutes);
};

/**
 * Checks if input is a time-only string ("HH:mm").
 */
const isTimeOnlyFormat = (timeOrIsoDate: string): boolean =>
  Number.isNaN(Date.parse(timeOrIsoDate));

/**
 * Formats a time string or full ISO datetime string to 12-hour time with am/pm.
 * If sessionDate is provided and timeOrIsoDate is "HH:mm", time is treated as UTC on that date, then converted to local time.
 * If a full ISO datetime string is passed, it's parsed directly.
 *
 * @param timeOrIsoDate - "HH:mm" or full ISO datetime string
 * @param sessionDate - Optional YYYY-MM-DD date string
 * @returns Formatted 12-hour time string (e.g., "2:00pm")
 */
export const formatSessionTime = (timeOrIsoDate: string, sessionDate?: string): string => {
  if (!timeOrIsoDate) return '';

  if (sessionDate && isTimeOnlyFormat(timeOrIsoDate)) {
    const [hh, mm] = timeOrIsoDate.split(':');
    const date = new Date(`${sessionDate}T${hh}:${mm}:00Z`);
    return formatHoursMinutes(date.getHours(), date.getMinutes());
  } else if (isTimeOnlyFormat(timeOrIsoDate)) {
    return formatTimeString(timeOrIsoDate);
  } else {
    const date = new Date(timeOrIsoDate);
    return formatHoursMinutes(date.getHours(), date.getMinutes());
  }
};

export const getHearingSlotTimeOptions = (hearingSlot: HearingSlot): SelectTimeOption[] => {
  const { courtSession, slotStartTimes = [] } = hearingSlot;
  const sessionRange = CUSTOM_SESSION_TIME_LIMITS[courtSession];

  const isWithinSessionRange = (localTime: string): boolean =>
    localTime >= sessionRange.min && localTime <= sessionRange.max;

  return slotStartTimes
    .filter((slot) => {
      const localStart = new Date(slot.sessionStartTime);
      const localStartTimeStr = localStart.toTimeString().slice(0, 5); // "HH:mm"
      return isWithinSessionRange(localStartTimeStr);
    })
    .map((slot) => ({
      value: slot.sessionStartTime,
      count: slot.count,
      label: `${formatSessionTime(slot.sessionStartTime)} to ${formatSessionTime(
        slot.sessionEndTime
      )}`
    }));
};

export const getHearingSlotTimestamp = ({
  sessionDate,
  slotStartTimes,
  courtSession
}: HearingSlot): string => {
  if (slotStartTimes?.[0]?.sessionStartTime) {
    return slotStartTimes[0].sessionStartTime;
  }

  const defaultTime = courtSession === 'PM' ? '14:00' : '10:00';
  return new Date(`${sessionDate}T${defaultTime}`).toISOString();
};
