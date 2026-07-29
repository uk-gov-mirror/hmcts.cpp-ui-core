import { ListingNote } from '../types';
import {
  createListingNoteSuccess,
  deleteListingNoteSuccess,
  loadListingNotes,
  showListingNoteSuccessMessage,
  updateListingNoteSuccess
} from '../actions/listing-notes.actions';
import { scheduling, SchedulingState } from './scheduling';

const listingNotesStateMock = {
  listingNotes: {
    notes: [],
    publishStatusMessage: undefined
  }
} as unknown as SchedulingState;

describe('Listing notes reducer', () => {
  it('should load listing notes', () => {
    const state = listingNotesStateMock;
    const notes = [{ id: 'note-id' } as ListingNote];

    const actualState = scheduling(state, loadListingNotes({ notes }));

    expect(actualState.listingNotes.notes).toEqual(notes);
  });

  it('should create listing note', () => {
    const state = listingNotesStateMock;
    const note = { id: 'note-id', courtRoomId: 'courtRoomId' } as ListingNote;

    const actualState = scheduling(state, createListingNoteSuccess({ note }));

    expect(actualState.listingNotes.notes).toContainEqual(note);
  });

  it('should update note', () => {
    const state = {
      ...listingNotesStateMock,
      listingNotes: {
        notes: [{ id: 'note-id', note: 'created note' }] as ListingNote[]
      }
    };

    const payload = { noteId: 'note-id', noteDescription: 'updated note' };
    const actualState = scheduling(state, updateListingNoteSuccess(payload));

    expect(actualState.listingNotes.notes[0]).toEqual({ id: 'note-id', note: 'updated note' });
  });

  it('should delete note', () => {
    const state = {
      ...listingNotesStateMock,
      notes: [{ id: 'note-id', note: 'created note' }] as ListingNote[]
    };

    const noteId = { noteId: 'note-id' };
    const actualState = scheduling(state, deleteListingNoteSuccess(noteId));

    expect(actualState.listingNotes.notes).toEqual([]);
  });

  it('should set publishStatusMessage', () => {
    const state = listingNotesStateMock;
    const successMessage = 'Note saved successfully';

    const actualState = scheduling(state, showListingNoteSuccessMessage({ successMessage }));

    expect(actualState.listingNotes.publishStatusMessage).toBe(successMessage);
  });
});
