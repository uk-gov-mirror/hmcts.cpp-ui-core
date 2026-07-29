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
import { loadCPSCaseStatuses } from '../actions/reference-data.actions';
import { getCPSCaseStatuses, ReferenceDataState } from '../reducers/index';
import { CPSCaseStatus } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cps-case-status-select',
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
      useExisting: forwardRef(() => CPSCaseStatusSelectComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => CPSCaseStatusSelectComponent)
    }
  ],
  imports: [PdkSelectComponent, AsyncPipe]
})
export class CPSCaseStatusSelectComponent
  implements OnInit, ControlValueAccessor, FormFieldControl
{
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
      select(getCPSCaseStatuses),
      map((cpsCaseStatuses) => {
        if (cpsCaseStatuses) {
          return cpsCaseStatuses.map((cpsCaseStatus) => ({
            value: cpsCaseStatus.id,
            label: cpsCaseStatus.statusDescription
          }));
        }
        return [];
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getCPSCaseStatuses), take(1)).subscribe((cpsCaseStatuses) => {
        if (!cpsCaseStatuses) {
          this.store.dispatch(loadCPSCaseStatuses());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.selectRef.registerOnChange((cpsCaseStatusId?: string) => {
      this.store
        .pipe(
          select(getCPSCaseStatuses),
          take(1),
          map((cpsCaseStatuses) => {
            if (cpsCaseStatuses) {
              return cpsCaseStatuses.find(({ id }) => id === cpsCaseStatusId);
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

  writeValue(value?: CPSCaseStatus) {
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
