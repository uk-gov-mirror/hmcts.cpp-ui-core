import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormFieldControl, SelectChangeEvent, PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { loadBookingTypes } from '../actions/reference-data.actions';
import { getBookingTypes, ReferenceDataState } from '../reducers/index';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'booking-types-select',
  template: `
    <pdk-select
      [ariaDescribedBy]="ariaDescribedBy"
      [disabled]="disabled"
      [id]="id"
      [justified]="justified"
      [name]="name"
      [options]="options$ | async"
      [placeholder]="placeholder"
      [required]="required"
      (change)="change.emit($event)"
    >
    </pdk-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BookingTypesSelectComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => BookingTypesSelectComponent)
    }
  ],
  imports: [PdkSelectComponent, AsyncPipe]
})
export class BookingTypesSelectComponent implements OnInit, ControlValueAccessor, FormFieldControl {
  @Input() ariaDescribedBy: string | null = null;
  @Input() disabled?: boolean;
  @Input() fetchOptionsOnMount = true;
  @Input() id!: string;
  @Input() justified?: boolean;
  @Input() name!: string;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Output() change = new EventEmitter<SelectChangeEvent>();

  @ViewChild(PdkSelectComponent, { static: true }) selectRef!: PdkSelectComponent;

  options$: Observable<SelectOption[]>;

  constructor(private store: Store<ReferenceDataState>) {
    this.options$ = this.store.pipe(
      select(getBookingTypes),
      map((assignPriorities) => {
        if (assignPriorities) {
          return assignPriorities.map(({ id, typeValue }) => ({
            value: id,
            label: typeValue
          }));
        }
        return [];
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getBookingTypes), take(1)).subscribe((bookingTypes) => {
        if (!bookingTypes) {
          this.store.dispatch(loadBookingTypes());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.selectRef.registerOnChange((bookingTypeId?: string) => {
      this.store
        .pipe(
          select(getBookingTypes),
          take(1),
          map((bookingTypes) => {
            if (bookingTypes) {
              return bookingTypes.find(({ id }) => id === bookingTypeId);
            }
            return undefined;
          })
        )
        .subscribe(fn);
    });
  };

  // ControlValueAccessor forwarding

  propagateChange: (_: any) => void = (fn: any) => {
    this.selectRef.propagateChange(fn);
  };

  registerOnTouched(fn: any) {
    this.selectRef.registerOnTouched(fn);
  }

  writeValue(value?: string) {
    this.selectRef.writeValue(value ? value : undefined);
  }

  // FormFieldControl forwarding

  get controlType() {
    return this.selectRef.controlType;
  }

  get multi() {
    return this.selectRef.multi;
  }

  get ngControl() {
    return this.selectRef.ngControl;
  }

  get controlRef() {
    return this.selectRef.controlRef;
  }
}
