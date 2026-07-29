import { createAction, props } from '@ngrx/store';
import { ListingNote } from '../types';

export const loadListingNotes = createAction(
  'LOAD_LISTING_NOTES',
  props<{ notes: ListingNote[] }>()
);

export const createListingNote = createAction(
  'CREATE_LISTING_NOTE',
  props<{
    note: {
      hearingDate: string;
      courtRoomId: string;
      noteDescription: string;
    };
  }>()
);

export const createListingNoteSuccess = createAction(
  'CREATE_LISTING_NOTE_SUCCESS',
  props<{ note: ListingNote }>()
);

export const updateListingNote = createAction(
  'UPDATE_LISTING_NOTE',
  props<{ noteId: string; noteDescription: string }>()
);

export const updateListingNoteSuccess = createAction(
  'UPDATE_LISTING_NOTE_SUCCESS',
  props<{ noteId: string; noteDescription: string }>()
);

export const deleteListingNote = createAction('DELETE_LISTING_NOTE', props<{ noteId: string }>());

export const deleteListingNoteSuccess = createAction(
  'DELETE_LISTING_NOTE_SUCCESS',
  props<{ noteId: string }>()
);

export const showListingNoteSuccessMessage = createAction(
  'SHOW_LISTING_NOTE_SUCCESS_MESSAGE',
  props<{ successMessage: string }>()
);
