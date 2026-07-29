import { createReducer, on } from '@ngrx/store';
import { Allocation, ListingNotes } from '../types';
import { ListingNotesActions, SchedulingActions } from '../actions/index';

export interface SchedulingState {
  allocation: Allocation;
  listingNotes: ListingNotes;
}

export const initialState: SchedulingState = {
  allocation: {
    params: null,
    totalResults: -1,
    hearingSlots: []
  },
  listingNotes: {
    notes: [],
    publishStatusMessage: undefined
  }
};

export const scheduling = createReducer(
  initialState,

  // Allocation
  on(
    SchedulingActions.loadHearingSlotsSuccess,
    (state, { totalResults, hearingSlots, params }) => ({
      ...state,
      allocation: {
        ...state.allocation,
        hearingSlots: [...hearingSlots],
        totalResults,
        params
      }
    })
  ),

  on(SchedulingActions.resetHearingSlots, (state) => ({
    ...state,
    allocation: initialState.allocation
  })),

  // Listing notes
  on(ListingNotesActions.loadListingNotes, (state, { notes }) => ({
    ...state,
    listingNotes: {
      ...state.listingNotes,
      notes
    }
  })),

  on(ListingNotesActions.createListingNoteSuccess, (state, { note }) => ({
    ...state,
    listingNotes: {
      ...state.listingNotes,
      notes: [...state.listingNotes.notes, note]
    }
  })),

  on(
    ListingNotesActions.updateListingNoteSuccess,
    (state, { noteId: id, noteDescription: note }) => ({
      ...state,
      listingNotes: {
        ...state.listingNotes,
        notes: state.listingNotes.notes.map((listingNote) =>
          listingNote.id === id ? { ...listingNote, note } : listingNote
        )
      }
    })
  ),

  on(ListingNotesActions.showListingNoteSuccessMessage, (state, { successMessage }) => ({
    ...state,
    listingNotes: {
      ...state.listingNotes,
      publishStatusMessage: successMessage
    }
  })),

  on(ListingNotesActions.deleteListingNoteSuccess, (state, { noteId }) => ({
    ...state,
    listingNotes: {
      ...state.listingNotes,
      notes: state.listingNotes.notes.filter(({ id }) => id !== noteId)
    }
  }))
);
