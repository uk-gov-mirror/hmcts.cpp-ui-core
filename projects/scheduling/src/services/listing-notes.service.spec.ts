import { TestBed } from '@angular/core/testing';
import { CppHttp } from '@cpp/core';
import { cold } from 'jasmine-marbles';
import { ListingNote } from '../types';
import { ListingNotesService } from './listing-notes.service';

describe('ListingNotesService', () => {
  let service: ListingNotesService;
  let http: CppHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ListingNotesService,
        {
          provide: CppHttp,
          useValue: {
            commandSync: jest.fn()
          }
        }
      ],
      teardown: { destroyAfterEach: false }
    });
    http = TestBed.inject(CppHttp);
    service = TestBed.inject(ListingNotesService);
  });

  describe('Listing Notes', () => {
    it('#createListingNotes should create listing note as instructed', () => {
      const newNote = {
        id: 'noteId',
        date: '*',
        courtRoomId: 'courtRoomId',
        note: '*'
      } as ListingNote;
      const expected$ = cold('-b|', { b: newNote });

      (http.commandSync as jest.Mock).mockImplementation(({ body }: { body: any }) => {
        const createdNote = {
          id: 'noteId',
          date: body.hearingDate,
          courtRoomId: body.courtRoomId,
          note: body.noteDescription
        } as ListingNote;

        return cold('-a|', { a: createdNote });
      });

      const noteData = {
        hearingDate: '*',
        courtRoomId: 'courtRoomId',
        noteDescription: '*'
      };
      const command$ = service.createListingNotes(noteData);
      expect(command$).toBeObservable(expected$);
    });

    it('#updateListingNote should update listing note as instructed', () => {
      const updatedData = { noteId: 'noteId', noteDescription: 'description' };
      const expected$ = cold('-a|', { a: updatedData });

      (http.commandSync as jest.Mock).mockImplementation(({ body }: { body: any }) =>
        cold('-b|', { b: { noteId: 'noteId', noteDescription: body.noteDescription } })
      );

      const update = { noteId: 'noteId', noteDescription: 'description' };
      const command$ = service.updateListingNote(update);
      expect(command$).toBeObservable(expected$);
    });

    it('#deleteListingNote should deleteNote listing note as instructed', () => {
      const deleteData = 'noteId';
      const expected$ = cold('-a|', { a: true });

      (http.commandSync as jest.Mock).mockImplementation(
        (_args: { url: string; successEvent: string }) => cold('-b|', { b: true })
      );

      const command$ = service.deleteListingNote(deleteData);

      expect(command$).toBeObservable(expected$);
    });
  });
});
