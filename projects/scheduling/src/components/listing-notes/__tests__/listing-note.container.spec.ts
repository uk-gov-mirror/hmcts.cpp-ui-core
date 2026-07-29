import { ValidationError } from '@cpp/pdk';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ListingNoteContainerComponent } from '../listing-note.container';
import { By } from '@angular/platform-browser';
import {
  createListingNote,
  deleteListingNote,
  updateListingNote
} from '../../../actions/listing-notes.actions';
import { getPublishStatusMessage } from '../../../selectors/listing-notes';
import { SchedulingState } from '../../../reducers/';
import { ListingNoteComponent } from '../listing-note.component';
import { DeleteListingNoteConfirmationComponent } from '../delete-listing-note-confirmation.component';

describe('ListingNoteContainerComponent', () => {
  let store: MockStore<SchedulingState>;
  let fixture: ComponentFixture<ListingNoteContainerComponent>;
  let hostComponent: ListingNoteContainerComponent;
  const initialState = {
    listingNotes: {
      notes: [],
      publishStatusMessage: undefined
    }
  } as unknown as SchedulingState;

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = () => {};
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ListingNoteContainerComponent,
        ListingNoteComponent,
        DeleteListingNoteConfirmationComponent
      ],
      declarations: [],
      providers: [provideMockStore({ initialState })],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ListingNoteContainerComponent);
    hostComponent = fixture.componentInstance;
    hostComponent.showDeleteConfirmation$.next(false);
    fixture.detectChanges();
  });

  it('render the listing note container component', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('#listingnote', () => {
    beforeEach(() => {
      store.setState({
        listingNotes: {
          notes: [
            {
              id: 'note-id-1',
              courtRoomId: 'court-room-id-1',
              note: 'This is a test',
              date: '2020-09-21'
            }
          ]
        }
      } as unknown as SchedulingState);

      hostComponent.courtRoomId = 'court-room-id-1';
      hostComponent.listingNoteDate = '2020-09-21';
      hostComponent.showDeleteConfirmation$.next(false);
      fixture.detectChanges();
    });

    it('should render listing note for provided date and courtroom id ', () => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should set editMode to true when onEdit event is fired', () => {
      fixture.detectChanges();
      const listingNoteComponent = fixture.debugElement.query(
        By.directive(ListingNoteComponent)
      ).componentInstance;
      listingNoteComponent.onEdit.emit();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should set editMode to false when oncancel event is fired', () => {
      fixture.detectChanges();
      const listingNoteComponent = fixture.debugElement.query(
        By.directive(ListingNoteComponent)
      ).componentInstance;
      listingNoteComponent.onCancel.emit();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should emit errors if onErrors event is fired', () => {
      jest.spyOn(hostComponent.onErrors, 'emit');

      const listingNoteComponent = fixture.debugElement.query(
        By.directive(ListingNoteComponent)
      ).componentInstance;

      listingNoteComponent.onError.emit([{ message: 'error' } as ValidationError]);

      expect(hostComponent.onErrors.emit).toHaveBeenCalledWith([{ message: 'error' }]);
    });

    it('should dispatch createListNote action when submitting new note', () => {
      hostComponent.courtRoomId = 'court-room-id-1';
      hostComponent.listingNoteDate = '2020-09-21';
      jest.spyOn(store, 'dispatch');
      const listingNoteComponent = fixture.debugElement.query(
        By.directive(ListingNoteComponent)
      ).componentInstance;
      fixture.detectChanges();

      listingNoteComponent.onSubmit.emit({ noteDescription: 'This is a new note' });

      expect(store.dispatch).toHaveBeenCalledWith(
        createListingNote({
          note: {
            noteDescription: 'This is a new note',
            courtRoomId: 'court-room-id-1',
            hearingDate: '2020-09-21'
          }
        })
      );
    });

    it('should dispatch updateListNote action when submitting note updates', () => {
      hostComponent.courtRoomId = 'court-room-id-1';
      hostComponent.listingNoteDate = '2020-09-21';
      jest.spyOn(store, 'dispatch');
      const listingNoteComponent = fixture.debugElement.query(
        By.directive(ListingNoteComponent)
      ).componentInstance;
      fixture.detectChanges();

      listingNoteComponent.onSubmit.emit({
        noteId: 'note-id',
        noteDescription: 'This is a new note'
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        updateListingNote({ noteId: 'note-id', noteDescription: 'This is a new note' })
      );
    });

    it('should dispatch updateListingNote action and display the status message when submitting note updates', () => {
      hostComponent.courtRoomId = 'court-room-id-1';
      hostComponent.listingNoteDate = '2020-09-21';
      const updatedNote = {
        noteId: 'note-id-1',
        noteDescription: 'Updated note description'
      };
      jest.spyOn(store, 'dispatch');

      const listingNoteComponent = fixture.debugElement.query(
        By.directive(ListingNoteComponent)
      ).componentInstance;
      fixture.detectChanges();

      listingNoteComponent.onSubmit.emit(updatedNote);

      expect(store.dispatch).toHaveBeenCalledWith(
        updateListingNote({ noteId: 'note-id-1', noteDescription: 'Updated note description' })
      );

      store.overrideSelector(getPublishStatusMessage, 'Listing note updated successfully');
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should dispatch deleteListingNote action when deleting a note', () => {
      jest.spyOn(store, 'dispatch');

      hostComponent.deleteNote('note-id-1');

      expect(store.dispatch).toHaveBeenCalledWith(deleteListingNote({ noteId: 'note-id-1' }));
    });
  });
});
