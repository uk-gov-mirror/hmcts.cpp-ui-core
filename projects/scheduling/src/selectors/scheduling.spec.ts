import { getSearchMetadata, getSearchParams, getSearchResults } from './scheduling';
import { SchedulingState } from '../reducers';

describe('Scheduling selectors', () => {
  describe('getSearchParams', () => {
    it('should return search params without pagination info', () => {
      const state = {
        scheduling: {
          allocation: {
            params: {
              pageSize: 5,
              pageNumber: 2,
              court: 'ABC',
              startDate: '2025-01-01',
              endDate: '2025-01-02'
            }
          }
        }
      } as unknown as SchedulingState;

      const result = getSearchParams(state);

      expect(result).toEqual({
        court: 'ABC',
        startDate: '2025-01-01',
        endDate: '2025-01-02'
      });
    });

    it('should return undefined if params are not defined', () => {
      const state = {
        scheduling: {
          allocation: {
            params: undefined
          }
        }
      } as unknown as SchedulingState;

      const result = getSearchParams(state);

      expect(result).toBeUndefined();
    });
  });

  describe('getSearchMetadata', () => {
    it('should return metadata with totalResults, pageSize and currentPage', () => {
      const state = {
        scheduling: {
          allocation: {
            totalResults: 42,
            params: {
              pageSize: 20,
              pageNumber: 3
            }
          }
        }
      } as unknown as SchedulingState;

      const result = getSearchMetadata(state);

      expect(result).toEqual({
        totalResults: 42,
        pageSize: 20,
        currentPage: 3
      });
    });

    it('should fallback to default pageSize if not provided', () => {
      const state = {
        scheduling: {
          allocation: {
            totalResults: 10,
            params: {
              pageNumber: 1
            }
          }
        }
      } as unknown as SchedulingState;

      const result = getSearchMetadata(state);

      expect(result).toEqual({
        totalResults: 10,
        pageSize: 10,
        currentPage: 1
      });
    });

    it('should handle undefined params', () => {
      const state = {
        scheduling: {
          allocation: {
            totalResults: 5,
            params: undefined
          }
        }
      } as unknown as SchedulingState;

      const result = getSearchMetadata(state);

      expect(result).toEqual({
        totalResults: 5,
        pageSize: 10,
        currentPage: undefined
      });
    });
  });

  describe('getSearchResults', () => {
    it('should return hearing slots', () => {
      const state = {
        scheduling: {
          allocation: {
            hearingSlots: [{ id: 'slot-1' }, { id: 'slot-2' }]
          }
        }
      } as unknown as SchedulingState;

      const result = getSearchResults(state);

      expect(result).toEqual([{ id: 'slot-1' }, { id: 'slot-2' }]);
    });
  });
});
