import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectionStrategy,
  AfterViewChecked,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  PdkFoldableTextComponent,
  PdkButton,
  PdkCore,
  PdkForm,
  PdkInput,
  PdkResizeDirective,
  PdkTextInputDirective,
  ValidationError
} from '@cpp/pdk';
import { FormsModule, NgForm } from '@angular/forms';
import { ListingNote } from '../../types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'listing-note',
  templateUrl: './listing-note.component.html',
  styleUrls: ['./listing-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    PdkButton,
    PdkForm,
    PdkResizeDirective,
    PdkTextInputDirective,
    PdkInput,
    NgTemplateOutlet,
    PdkCore,
    PdkFoldableTextComponent
  ]
})
export class ListingNoteComponent implements OnChanges, AfterViewChecked {
  @Input() listingNote!: ListingNote;
  @Input() editMode = false;
  @Output() onEdit = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{ noteId?: string; noteDescription: string }>();
  @Output() onError = new EventEmitter<ValidationError[]>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onClearBanner = new EventEmitter<void>();
  @ViewChild('form') form!: NgForm;

  listingNoteLabel = 'Listing note';

  get displayCreateNoteLink() {
    return !this.editMode && Boolean(this.listingNote) === false;
  }

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.onClearBanner.emit();
  }

  ngAfterViewChecked() {
    if (this.form && this.form.valid && !this.form.dirty) {
      this.scroll();
    }
  }

  submit() {
    const { note } = this.form.value;
    const noteDescription = String(note).trim();
    const { id: noteId } = this.listingNote || { id: undefined };
    const noteData = noteId ? { noteId, noteDescription } : { noteDescription };
    this.onSubmit.emit(noteData);
  }

  scroll() {
    this.element.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  delete() {
    this.onDelete.emit();
  }

  changeLabel() {
    this.listingNoteLabel = 'Change listing note'; // Update the label
  }
}
