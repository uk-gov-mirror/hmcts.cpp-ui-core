import { ListingNote } from '../types';
import {
  createListingNote,
  createListingNoteSuccess,
  deleteListingNote,
  deleteListingNoteSuccess,
  loadListingNotes,
  updateListingNote,
  updateListingNoteSuccess
} from './listing-notes.actions';

it('Should create a loadListingNotes action ', () => {
  const notes = [
    {
      id: 'listing-note-1',
      courtRoomId: 'courtroom-id-1',
      note: 'test',
      date: '2020-09-16'
    } as ListingNote
  ];
  const action = loadListingNotes({ notes });

  expect(action).toEqual({
    type: 'LOAD_LISTING_NOTES',
    notes
  });
});

describe('Listing notes actions', () => {
  it('Should create a createListingNote action ', () => {
    const note = {
      courtRoomId: 'courtroom-id-1',
      noteDescription: 'test',
      hearingDate: '2020-09-16'
    };
    const action = createListingNote({ note });

    expect(action).toEqual({
      type: 'CREATE_LISTING_NOTE',
      note
    });
  });

  it('Should create a createListingNoteSuccess action ', () => {
    const note = {
      id: 'listing-note-1',
      courtRoomId: 'courtroom-id-1',
      note: 'test',
      date: '2020-09-16'
    } as ListingNote;
    const action = createListingNoteSuccess({ note });

    expect(action).toEqual({
      type: 'CREATE_LISTING_NOTE_SUCCESS',
      note
    });
  });

  it('Should create a updateListingNote action ', () => {
    const updateProperties = {
      noteId: 'listing-note-1',
      noteDescription: 'test'
    };
    const action = updateListingNote(updateProperties);

    expect(action).toEqual({
      type: 'UPDATE_LISTING_NOTE',
      ...updateProperties
    });
  });

  it('Should create a updateListingNoteSuccess action ', () => {
    const updateProperties = {
      noteId: 'listing-note-1',
      noteDescription: 'test'
    };
    const action = updateListingNoteSuccess(updateProperties);

    expect(action).toEqual({
      type: 'UPDATE_LISTING_NOTE_SUCCESS',
      ...updateProperties
    });
  });

  it('Should create a deleteListingNote action ', () => {
    const action = deleteListingNote({ noteId: 'listing-note-1' });

    expect(action).toEqual({
      type: 'DELETE_LISTING_NOTE',
      noteId: 'listing-note-1'
    });
  });

  it('Should create a deleteListingNoteSuccess action ', () => {
    const action = deleteListingNoteSuccess({ noteId: 'listing-note-1' });

    expect(action).toEqual({
      type: 'DELETE_LISTING_NOTE_SUCCESS',
      noteId: 'listing-note-1'
    });
  });
});
