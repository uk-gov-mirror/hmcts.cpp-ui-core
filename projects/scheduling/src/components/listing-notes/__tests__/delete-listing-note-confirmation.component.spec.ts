import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';
import { DeleteListingNoteConfirmationComponent } from '../delete-listing-note-confirmation.component';
import { Component } from '@angular/core';

describe('DeleteListingNoteConfirmationComponent', () => {
  let fixture: ComponentFixture<DeleteListingNoteConfirmationComponent>;
  let component: DeleteListingNoteConfirmationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DeleteListingNoteConfirmationComponent],
      teardown: { destroyAfterEach: false }
    });

    fixture = TestBed.createComponent(DeleteListingNoteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the component', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should submit confirmation', async () => {
    const emitSpy = jest.spyOn(component.onDelete, 'emit');

    fixture.debugElement.query(By.css('button[type=button]')).nativeElement.click();
    await fixture.whenStable();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should cancel confirmation', async () => {
    const cancelSpy = jest.spyOn(component.onCancel, 'emit');

    component.cancel();
    fixture.detectChanges();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
