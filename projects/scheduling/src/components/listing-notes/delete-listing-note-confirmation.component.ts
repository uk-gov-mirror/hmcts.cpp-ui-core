import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ListingNote } from '../../types';
import { PdkLinkDirective, PdkMarginDirective, PdkButton } from '@cpp/pdk';

@Component({
  selector: 'delete-listing-note-confirmation',
  template: `
    <div>
      <p class="bold" pdk-margin-bottom="0" pdk-margin-top="0">Listing note:</p>
      <span class="listnote-wrap">{{ listingNote?.note }}</span>
      <p class="bold">Do you want to delete this listing note?</p>
      <div class="delete-actions">
        <button pdk-button="warning" pdk-margin-bottom="0" type="button" (click)="delete()">
          Yes, delete
        </button>
        <a
          pdk-link
          unvisited
          pdk-margin-left="4"
          pdk-margin-bottom="0"
          href="javascript:void(0);"
          (click)="cancel()"
        >
          Cancel
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .listnote-wrap {
        overflow-wrap: break-word;
        max-width: 100%;
      }

      .delete-actions {
        display: flex;
        align-items: baseline;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdkButton, PdkLinkDirective, PdkMarginDirective]
})
export class DeleteListingNoteConfirmationComponent {
  @Output() onDelete = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Input() listingNote!: ListingNote;

  delete() {
    this.onDelete.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
