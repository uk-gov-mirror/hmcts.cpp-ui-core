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
import {
  CheckboxOption,
  FormFieldControl,
  PdkCheckboxGroupComponent,
  CheckboxChangeEvent,
  PdkPaddingDirective
} from '@cpp/pdk';
import { getSpecialRequirements, ReferenceDataState } from '../reducers';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { loadSpecialRequirements } from '../actions/reference-data.actions';
import { sortBy } from 'lodash-es';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'special-requirements-chekbox',
  template: `
    <pdk-checkbox-group
      [id]="id"
      [disabled]="disabled"
      [options]="options$ | async"
      [ariaDescribedBy]="ariaDescribedBy"
      pdk-padding="2"
      (change)="change.emit($event)"
    >
    </pdk-checkbox-group>
  `,
  styles: [
    `
      pdk-checkbox-group::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
      }
      pdk-checkbox-group::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
      }
      pdk-checkbox-group {
        border: 1px solid #eaeaea;
        height: 200px;
        overflow-y: scroll;
        display: block;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpecialRequirementCheckboxComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => SpecialRequirementCheckboxComponent)
    }
  ],
  imports: [PdkCheckboxGroupComponent, AsyncPipe, PdkPaddingDirective]
})
export class SpecialRequirementCheckboxComponent
  implements ControlValueAccessor, FormFieldControl, OnInit
{
  @Input() id!: string;
  @Input() disabled = false;
  @Input() ariaDescribedBy!: string;
  @Input() fetchOptionsOnMount = true;
  @Output() change = new EventEmitter<CheckboxChangeEvent<string>>();
  @ViewChild(PdkCheckboxGroupComponent, { static: true })
  checkboxGroupRef!: PdkCheckboxGroupComponent<string>;

  options$: Observable<CheckboxOption<string>[]>;

  constructor(private store: Store<ReferenceDataState>) {
    this.options$ = this.store.pipe(
      select(getSpecialRequirements),
      map((specialRequirements) => {
        if (specialRequirements) {
          const sortedItems = sortBy(specialRequirements, (s) => s.requirementValue);
          return sortedItems.map((specialRequirement) => ({
            value: specialRequirement.requirementCode,
            label: specialRequirement.requirementValue
          }));
        }
        return [];
      })
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getSpecialRequirements), take(1)).subscribe((specialRequirements) => {
        if (!specialRequirements) {
          this.store.dispatch(loadSpecialRequirements());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.checkboxGroupRef.registerOnChange(fn);
  };

  // ControlValueAccessor forwarding
  propagateChange: (_: any) => void = (fn: any) => {
    this.checkboxGroupRef.propagateChange(fn);
  };

  registerOnTouched(fn: any) {
    this.checkboxGroupRef.registerOnTouched(fn);
  }

  writeValue(values?: string[]) {
    this.checkboxGroupRef.writeValue(values ? values : []);
  }

  // FormFieldControl forwarding
  get controlType() {
    return this.checkboxGroupRef.controlType;
  }

  get multi() {
    return this.checkboxGroupRef.multi;
  }

  get ngControl() {
    return this.checkboxGroupRef.ngControl;
  }

  get controlRef() {
    return this.checkboxGroupRef.controlRef;
  }
}
