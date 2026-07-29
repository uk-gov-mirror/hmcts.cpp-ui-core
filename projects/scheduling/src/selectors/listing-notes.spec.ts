import { TestBed } from '@angular/core/testing';
import {
  getListingNoteByCourtRoomAndDate,
  getListingNotes,
  getListingNotesMap
} from './listing-notes';
import { ListingNote } from '../types';
import { SchedulingState } from '../reducers';

describe('Listing note selectors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      teardown: { destroyAfterEach: false }
    });
  });

  describe('getListingNotes', () => {
    it('should get listing notes from store', () => {
      const state = {
        scheduling: {
          listingNotes: {
            notes: [{ id: 'note-id' }] as ListingNote[],
            publishStatusMessage: null
          }
        }
      } as unknown as SchedulingState;

      const notes = getListingNotes(state);

      expect(notes).toEqual([{ id: 'note-id' }]);
    });
  });

  describe('getListingNotesMap', () => {
    it('should get map of listing notes', () => {
      const listingNotes = [
        {
          id: 'note-id',
          courtRoomId: 'courtRoom-id-1',
          note: 'note-1',
          date: '2020-09-16'
        },
        {
          id: 'note-id-2',
          courtRoomId: 'courtRoom-id-1',
          note: 'note-2',
          date: '2020-09-22'
        },
        {
          id: 'note-id-3',
          courtRoomId: 'courtRoom-id-2',
          note: 'note-3',
          date: '2020-09-16'
        },
        {
          id: 'note-id-4',
          courtRoomId: 'courtRoom-id-2',
          note: 'note-4',
          date: '2020-09-22'
        }
      ] as ListingNote[];

      const expectedMap = {
        'courtRoom-id-1': {
          '2020-09-16': listingNotes[0],
          '2020-09-22': listingNotes[1]
        },
        'courtRoom-id-2': {
          '2020-09-16': listingNotes[2],
          '2020-09-22': listingNotes[3]
        }
      };

      expect(getListingNotesMap.projector(listingNotes)).toEqual(expectedMap);
    });
  });

  describe('getListingNoteByCourtRoomAndDate', () => {
    it('should get listing note by court room and date', () => {
      const courtRoom = 'courtRoom-id-1';
      const date = '2020-09-16';

      const listingNoteMap = {
        'courtRoom-id-1': {
          '2020-09-16': {
            id: 'note-id',
            courtRoomId: 'courtRoom-id-1',
            note: 'note-1',
            date: '2020-09-16'
          },
          '2020-09-22': {
            id: 'note-id-2',
            courtRoomId: 'courtRoom-id-1',
            note: 'note-2',
            date: '2020-09-22'
          }
        },
        'courtRoom-id-2': {
          '2020-09-16': {
            id: 'note-id-3',
            courtRoomId: 'courtRoom-id-2',
            note: 'note-3',
            date: '2020-09-16'
          },
          '2020-09-22': {
            id: 'note-id-4',
            courtRoomId: 'courtRoom-id-2',
            note: 'note-4',
            date: '2020-09-22'
          }
        }
      };

      const expectedListingNote = listingNoteMap['courtRoom-id-1']['2020-09-16'];

      const getListingNoteSelector = getListingNoteByCourtRoomAndDate(courtRoom, date);

      expect(getListingNoteSelector.projector(listingNoteMap)).toEqual(expectedListingNote);
    });
  });
});
