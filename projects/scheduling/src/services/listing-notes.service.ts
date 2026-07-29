import { Observable } from 'rxjs';
import { ListingNote } from '../types';
import { Injectable } from '@angular/core';
import { CppHttp } from '@cpp/core';

@Injectable({
  providedIn: 'root'
})
export class ListingNotesService {
  constructor(private cppHttp: CppHttp) {}

  createListingNotes(note: {
    hearingDate: string;
    courtRoomId: string;
    noteDescription: string;
  }): Observable<ListingNote> {
    return this.cppHttp.commandSync<ListingNote>({
      url: `/listing-command-api/command/api/rest/listing/listing-note`,
      requestType: 'application/vnd.listing.command.create-listing-note+json',
      successEvent: 'public.listing.created-listing-note',
      body: note
    });
  }

  updateListingNote({
    noteId,
    noteDescription
  }: {
    noteId: string;
    noteDescription: string;
  }): Observable<{
    noteId: string;
    noteDescription: string;
  }> {
    return this.cppHttp.commandSync<{ noteId: string; noteDescription: string }>({
      url: `/listing-command-api/command/api/rest/listing/listing-notes/${noteId}`,
      requestType: 'application/vnd.listing.command.edit-listing-note+json',
      successEvent: 'public.listing.note-edited',
      body: { noteDescription }
    });
  }

  deleteListingNote(noteId: string): Observable<{ noteId: string }> {
    return this.cppHttp.commandSync<{ noteId: string; noteDescription: string }>({
      url: `/listing-command-api/command/api/rest/listing/listing-notes/${noteId}`,
      requestType: ' application/vnd.listing.command.delete-listing-note+json',
      successEvent: 'public.listing.deleted-listing-note'
    });
  }
}
