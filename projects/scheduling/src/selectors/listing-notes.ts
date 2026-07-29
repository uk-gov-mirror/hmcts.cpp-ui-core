import { createSelector } from '@ngrx/store';
import { SchedulingState } from '../reducers';
import { ListingNote } from '../types';

export const getListingNotesState = (state: SchedulingState) => state.scheduling.listingNotes;

export const getListingNotes = createSelector(
  getListingNotesState,
  (listingNotesState) => listingNotesState.notes
);

export const getListingNotesMap = createSelector(getListingNotes, (listingNotes: ListingNote[]) =>
  listingNotes.reduce(
    (notesMap, note) => ({
      ...notesMap,
      [note.courtRoomId]: {
        ...notesMap[note.courtRoomId],
        [note.date]: note
      }
    }),
    {} as Record<string, Record<string, ListingNote>>
  )
);

export const getListingNoteByCourtRoomAndDate = (courtRoomId: string, hearingDate: string) =>
  createSelector(getListingNotesMap, (notesMap) => notesMap[courtRoomId]?.[hearingDate]);

export const getPublishStatusMessage = createSelector(
  getListingNotesState,
  (listingNotesState) => listingNotesState.publishStatusMessage
);
