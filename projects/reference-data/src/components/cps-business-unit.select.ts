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
import { loadCPSBusinessUnits } from '../actions/reference-data.actions';
import { getCPSBusinessUnits, ReferenceDataState } from '../reducers/index';
import { CPSBusinessUnit } from '../reference-data.interfaces';

@Component({
  selector: 'cps-business-unit-select',
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
      useExisting: forwardRef(() => CPSBusinessUnitSelectComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => CPSBusinessUnitSelectComponent)
    }
  ],
  imports: [PdkSelectComponent]
})
export class CPSBusinessUnitSelectComponent
  implements OnChanges, OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() cmsAreaCode?: string;
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
    if (changes.cmsAreaCode) {
      if (!changes.cmsAreaCode.firstChange) {
        this.ngControl.reset();
      }
      this.store
        .select(getCPSBusinessUnits)
        .pipe(take(1))
        .subscribe((cpsBusinessUnits) => {
          this.options = changes.cmsAreaCode.currentValue
            ? (cpsBusinessUnits || [])
                .filter(
                  ({ cmsAreaCode }) =>
                    cmsAreaCode && cmsAreaCode.toString() === changes.cmsAreaCode.currentValue
                )
                .map((cpsBusinessUnit) => ({
                  value: cpsBusinessUnit.id,
                  label: cpsBusinessUnit.unitName
                }))
            : [];
        });
    }
  }

  constructor(private store: Store<ReferenceDataState>) {}

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getCPSBusinessUnits), take(1)).subscribe((cpsBusinessUnits) => {
        if (!cpsBusinessUnits) {
          this.store.dispatch(loadCPSBusinessUnits());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.selectRef.registerOnChange((cpsUnitId?: string) => {
      this.store
        .pipe(
          select(getCPSBusinessUnits),
          take(1),
          map((cpsBusinessUnits) => {
            if (cpsBusinessUnits) {
              return cpsBusinessUnits.find(({ id }) => id === cpsUnitId);
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

  writeValue(value?: CPSBusinessUnit) {
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
