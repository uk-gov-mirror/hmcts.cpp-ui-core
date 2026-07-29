import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormFieldControl, SelectChangeEvent, PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { loadWitnessCareUnits } from '../actions/reference-data.actions';
import { getWitnessCareUnits, ReferenceDataState } from '../reducers/index';
import { WitnessCareUnit } from '../reference-data.interfaces';

@Component({
  selector: 'witness-care-unit-select',
  template: `
    <pdk-select
      [ariaDescribedBy]="ariaDescribedBy"
      [disabled]="disabled"
      [id]="id"
      [justified]="justified"
      [name]="name"
      [options]="options"
      [placeholder]="placeholder"
      [required]="required"
      (change)="change.emit($event)"
    >
    </pdk-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WitnessCareUnitSelectComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => WitnessCareUnitSelectComponent)
    }
  ],
  imports: [PdkSelectComponent]
})
export class WitnessCareUnitSelectComponent
  implements OnChanges, OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() policeForceCode?: string;
  @Input() disabled?: boolean;
  @Input() fetchOptionsOnMount = true;
  @Input() id!: string;
  @Input() justified?: boolean;
  @Input() name!: string;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Output() change = new EventEmitter<SelectChangeEvent>();

  @ViewChild(PdkSelectComponent, { static: true }) selectRef!: PdkSelectComponent;

  options: SelectOption[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.policeForceCode) {
      if (!changes.policeForceCode.firstChange) {
        this.ngControl.reset();
      }
      this.store
        .select(getWitnessCareUnits)
        .pipe(take(1))
        .subscribe((witnessCareUnits) => {
          this.options = changes.policeForceCode.currentValue
            ? (witnessCareUnits || [])
                .filter(
                  ({ policeForceCode }) =>
                    policeForceCode &&
                    policeForceCode.toString() === changes.policeForceCode.currentValue
                )
                .map((witnessCareUnit) => ({
                  value: witnessCareUnit.id,
                  label: witnessCareUnit.wcuName
                }))
            : [];
        });
    }
  }

  constructor(private store: Store<ReferenceDataState>) {}

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getWitnessCareUnits), take(1)).subscribe((witnessCareUnits) => {
        if (!witnessCareUnits) {
          this.store.dispatch(loadWitnessCareUnits());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.selectRef.registerOnChange((wcuId?: string) => {
      this.store
        .pipe(
          select(getWitnessCareUnits),
          take(1),
          map((witnessCareUnits) => {
            if (witnessCareUnits) {
              return witnessCareUnits.find(({ id }) => id === wcuId);
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

  writeValue(value?: WitnessCareUnit) {
    this.selectRef.writeValue(value ? value.id : undefined);
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
