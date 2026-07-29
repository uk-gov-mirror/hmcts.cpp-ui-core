import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ListingNoteComponent } from '../listing-note.component';
import { ListingNote } from '../../../types';
import { By } from '@angular/platform-browser';

describe('ListingNoteComponent', () => {
  let fixture: ComponentFixture<ListingNoteComponent>;
  let component: ListingNoteComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ListingNoteComponent],
      teardown: { destroyAfterEach: false }
    });

    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    fixture = TestBed.createComponent(ListingNoteComponent);
    component = fixture.componentInstance;
  });

  it('should render a create listing note link', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should create listing note when in editmode without an existing note', () => {
    component.editMode = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  describe('Existing note', () => {
    const note = `
        Lorem ipsum dolor sit amet, usu ne tota vivendo ullamcorper,
        est ut quem minim omnium. Odio vero interpretaris ex duo,
        iudico cetero vidisse has ex, ea has aeterno sententiae.
        Consul primis liberavisse per ex, quaeque graecis per ut.
    `;
    beforeEach(() => {
      component.listingNote = { note } as ListingNote;
    });

    it('should be displayed as foldable note', () => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should be displayed in text area when in editmode', async () => {
      component.editMode = true;
      fixture.detectChanges();
      await fixture.whenStable();
      const textArea = fixture.debugElement.query(By.css('textarea'))
        .nativeElement as HTMLTextAreaElement;
      expect(textArea.value).toEqual(note);
      expect(fixture).toMatchSnapshot();
    });
  });

  it('should emit edit event when creating a note', async () => {
    fixture.detectChanges();
    const createNoteLink = fixture.debugElement.query(By.css('a[data-test-id="create-note"]'))
      .nativeElement as HTMLAnchorElement;
    const createSpy = jest.spyOn(component.onEdit, 'emit');
    createNoteLink.click();
    expect(createSpy).toHaveBeenCalled();
  });

  it('should emit edit event when editing a note', async () => {
    component.listingNote = { note: 'this is a test' } as ListingNote;
    fixture.detectChanges();
    const editNoteLink = fixture.debugElement.query(By.css('a[data-test-id="edit-note"]'))
      .nativeElement as HTMLAnchorElement;
    const createSpy = jest.spyOn(component.onEdit, 'emit');
    editNoteLink.click();
    expect(createSpy).toHaveBeenCalled();
  });

  it('should emit deleteNote event when note exists', async () => {
    component.listingNote = { note: 'this is a test' } as ListingNote;
    fixture.detectChanges();
    const deleteNoteLink = fixture.debugElement.query(By.css('a[data-test-id="delete-note"]'))
      .nativeElement as HTMLAnchorElement;
    const createSpy = jest.spyOn(component.onDelete, 'emit');
    deleteNoteLink.click();
    expect(createSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when editing a note', async () => {
    component.listingNote = { note: 'this is a test' } as ListingNote;
    component.editMode = true;
    fixture.detectChanges();
    const cancelNoteLink = fixture.debugElement.query(By.css('a[data-test-id="cancel-edit-note"]'))
      .nativeElement as HTMLAnchorElement;
    const createSpy = jest.spyOn(component.onCancel, 'emit');
    cancelNoteLink.click();
    expect(createSpy).toHaveBeenCalled();
  });
});
