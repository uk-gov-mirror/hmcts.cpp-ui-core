import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  PdkContextPanelComponent,
  PdkInsetTextComponent,
  PdkMarginDirective,
  PdkPaddingDirective,
  ValidationError
} from '@cpp/pdk';
import { ListingNote } from '../../types';
import { SchedulingState } from '../../reducers';
import {
  getPublishStatusMessage,
  getListingNoteByCourtRoomAndDate
} from '../../selectors/listing-notes';
import {
  createListingNote,
  updateListingNote,
  showListingNoteSuccessMessage,
  deleteListingNote
} from '../../actions/listing-notes.actions';
import { ListingNoteComponent } from './listing-note.component';
import { DeleteListingNoteConfirmationComponent } from './delete-listing-note-confirmation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'listing-note-container',
  template: `
    <pdk-inset-text
      class="govuk-inset-text"
      pdk-margin-top="2"
      pdk-padding-top="0"
      pdk-margin-bottom="0"
    >
      @if (displayStatusMessage$ | async; as displayStatusMessage) {
      <pdk-context-panel icon="tick" type="success">
        {{ displayStatusMessage }}
      </pdk-context-panel>
      } @if ((showDeleteConfirmation$ | async) === false) {
      <listing-note
        [listingNote]="listingNote$ | async"
        [editMode]="editMode"
        (onEdit)="editNote()"
        (onCancel)="cancel()"
        (onSubmit)="submitNote($event)"
        (onDelete)="showDeleteConfirmation()"
        (onError)="onErrors.emit($event)"
        (onClearBanner)="clearBanner()"
      >
      </listing-note>
      } @if (listingNote$ | async; as listingNote) { @if (showDeleteConfirmation$ | async) {
      <delete-listing-note-confirmation
        [listingNote]="listingNote"
        (onDelete)="deleteNote(listingNote.id)"
        (onCancel)="showDeleteConfirmation$.next(false)"
      >
      </delete-listing-note-confirmation>
      } }
    </pdk-inset-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdkInsetTextComponent,
    PdkContextPanelComponent,
    PdkMarginDirective,
    PdkPaddingDirective,
    CommonModule,
    ListingNoteComponent,
    DeleteListingNoteConfirmationComponent
  ]
})
export class ListingNoteContainerComponent implements OnInit, OnChanges {
  @Input() courtRoomId!: string;
  @Input() listingNoteDate!: string;
  @Output() onErrors = new EventEmitter<ValidationError[]>();
  editMode = false;
  listingNote$!: Observable<ListingNote | undefined>;
  showDeleteConfirmation$ = new BehaviorSubject(false);
  displayStatusMessage$!: Observable<string | undefined>;

  constructor(private store: Store<SchedulingState>) {}

  ngOnInit() {
    this.displayStatusMessage$ = this.store.pipe(select(getPublishStatusMessage));
  }

  ngOnChanges() {
    if (this.courtRoomId && this.listingNoteDate) {
      this.listingNote$ = this.store.pipe(
        select(getListingNoteByCourtRoomAndDate(this.courtRoomId, this.listingNoteDate))
      );
    }
    this.editMode = false;
    this.showDeleteConfirmation$.next(false);
  }

  clearBanner() {
    this.store.dispatch(showListingNoteSuccessMessage({ successMessage: '' }));
  }

  submitNote(data: { noteId?: string; noteDescription: string }) {
    const { noteId, noteDescription } = data;
    if (noteId) {
      this.store.dispatch(updateListingNote({ noteId, noteDescription }));
    } else {
      const note = {
        noteDescription,
        courtRoomId: this.courtRoomId,
        hearingDate: this.listingNoteDate
      };

      this.store.dispatch(createListingNote({ note }));
    }

    this.editMode = false;
  }

  deleteNote(noteId: string) {
    this.store.dispatch(deleteListingNote({ noteId }));
    this.showDeleteConfirmation$.next(false);
  }

  cancel() {
    this.editMode = false;
    this.onErrors.emit([]);
  }

  showDeleteConfirmation() {
    this.showDeleteConfirmation$.next(true);
  }

  editNote() {
    this.editMode = true;
  }
}
