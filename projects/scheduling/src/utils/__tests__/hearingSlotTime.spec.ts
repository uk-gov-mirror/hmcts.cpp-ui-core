import { getHearingSlotTimeOptions, formatSessionTime } from '../hearingSlotTime';
import { HearingSlot } from '../../types';

describe('getHearingSlotTimeOptions', () => {
  it('should return correct slot times for all-day split sessions', () => {
    const mockHearingSlot: HearingSlot = {
      courtSession: 'AD',
      sessionDate: '2025-03-25',
      slotStartTimes: [
        {
          sessionStartTime: '2025-03-25T10:00:00.000Z',
          sessionEndTime: '2025-03-25T13:00:00.000Z',
          count: 2
        },
        {
          sessionStartTime: '2025-03-25T14:00:00.000Z',
          sessionEndTime: '2025-03-25T17:00:00.000Z',
          count: 3
        }
      ],
      allDaySplit: true
    } as HearingSlot;

    const result = getHearingSlotTimeOptions(mockHearingSlot);

    expect(result).toEqual([
      { value: '2025-03-25T10:00:00.000Z', count: 2, label: '10:00am to 1:00pm' },
      { value: '2025-03-25T14:00:00.000Z', count: 3, label: '2:00pm to 5:00pm' }
    ]);
  });

  it('should return correct slot times for AM session', () => {
    const mockHearingSlot: HearingSlot = {
      sessionDate: '2025-03-25',
      courtSession: 'AM',
      slotStartTimes: [
        {
          sessionStartTime: '2025-03-25T10:00:00.000Z',
          sessionEndTime: '2025-03-25T11:00:00.000Z',
          count: 2
        },
        {
          sessionStartTime: '2025-03-25T11:00:00.000Z',
          sessionEndTime: '2025-03-25T12:00:00.000Z',
          count: 0
        },
        {
          sessionStartTime: '2025-03-25T12:00:00.000Z',
          sessionEndTime: '2025-03-25T13:00:00.000Z',
          count: 0
        }
      ],
      allDaySplit: false
    } as HearingSlot;

    const result = getHearingSlotTimeOptions(mockHearingSlot);

    expect(result).toEqual([
      { value: '2025-03-25T10:00:00.000Z', count: 2, label: '10:00am to 11:00am' },
      { value: '2025-03-25T11:00:00.000Z', count: 0, label: '11:00am to 12:00pm' },
      { value: '2025-03-25T12:00:00.000Z', count: 0, label: '12:00pm to 1:00pm' }
    ]);
  });

  it('should return correct slot times for PM session', () => {
    const mockHearingSlot: HearingSlot = {
      sessionDate: '2025-03-25',
      courtSession: 'PM',
      slotStartTimes: [
        {
          sessionStartTime: '2025-03-25T14:00:00.000Z',
          sessionEndTime: '2025-03-25T15:00:00.000Z',
          count: 3
        },
        {
          sessionStartTime: '2025-03-25T15:00:00.000Z',
          sessionEndTime: '2025-03-25T16:00:00.000Z',
          count: 0
        },
        {
          sessionStartTime: '2025-03-25T16:00:00.000Z',
          sessionEndTime: '2025-03-25T17:00:00.000Z',
          count: 0
        }
      ],
      allDaySplit: false
    } as HearingSlot;

    const result = getHearingSlotTimeOptions(mockHearingSlot);

    expect(result).toEqual([
      { value: '2025-03-25T14:00:00.000Z', count: 3, label: '2:00pm to 3:00pm' },
      { value: '2025-03-25T15:00:00.000Z', count: 0, label: '3:00pm to 4:00pm' },
      { value: '2025-03-25T16:00:00.000Z', count: 0, label: '4:00pm to 5:00pm' }
    ]);
  });

  it('should return correct slot times for AD session (morning + afternoon)', () => {
    const mockHearingSlot: HearingSlot = {
      sessionDate: '2025-03-25',
      courtSession: 'AD',
      slotStartTimes: [
        {
          sessionStartTime: '2025-03-25T10:00:00.000Z',
          sessionEndTime: '2025-03-25T11:00:00.000Z',
          count: 2
        },
        {
          sessionStartTime: '2025-03-25T11:00:00.000Z',
          sessionEndTime: '2025-03-25T12:00:00.000Z',
          count: 0
        },
        {
          sessionStartTime: '2025-03-25T12:00:00.000Z',
          sessionEndTime: '2025-03-25T13:00:00.000Z',
          count: 0
        },
        {
          sessionStartTime: '2025-03-25T14:00:00.000Z',
          sessionEndTime: '2025-03-25T15:00:00.000Z',
          count: 3
        },
        {
          sessionStartTime: '2025-03-25T15:00:00.000Z',
          sessionEndTime: '2025-03-25T16:00:00.000Z',
          count: 0
        },
        {
          sessionStartTime: '2025-03-25T16:00:00.000Z',
          sessionEndTime: '2025-03-25T17:00:00.000Z',
          count: 0
        }
      ],
      allDaySplit: false
    } as HearingSlot;

    const result = getHearingSlotTimeOptions(mockHearingSlot);

    expect(result).toEqual([
      { value: '2025-03-25T10:00:00.000Z', count: 2, label: '10:00am to 11:00am' },
      { value: '2025-03-25T11:00:00.000Z', count: 0, label: '11:00am to 12:00pm' },
      { value: '2025-03-25T12:00:00.000Z', count: 0, label: '12:00pm to 1:00pm' },
      { value: '2025-03-25T14:00:00.000Z', count: 3, label: '2:00pm to 3:00pm' },
      { value: '2025-03-25T15:00:00.000Z', count: 0, label: '3:00pm to 4:00pm' },
      { value: '2025-03-25T16:00:00.000Z', count: 0, label: '4:00pm to 5:00pm' }
    ]);
  });
});

describe('formatSessionTime', () => {
  it('should format ISO string as expected', () => {
    const result = formatSessionTime('2025-03-25T10:30:00.000Z');
    expect(result).toBe('10:30am');
  });

  it('should format HH:mm string with sessionDate', () => {
    const result = formatSessionTime('10:00', '2025-03-25');
    expect(result).toBe('10:00am');
  });

  it('should fallback to local time formatting when sessionDate is not provided', () => {
    const result = formatSessionTime('15:00');
    expect(result.includes('pm')).toBe(true);
  });

  it('should handle 12:00 edge cases correctly', () => {
    const morning = formatSessionTime('2025-03-25T00:00:00.000Z');
    const noon = formatSessionTime('2025-03-25T12:00:00.000Z');
    expect(morning).toBe('12:00am');
    expect(noon).toBe('12:00pm');
  });
});
