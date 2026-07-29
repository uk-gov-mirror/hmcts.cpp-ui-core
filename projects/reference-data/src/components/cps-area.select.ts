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
import { loadCPSAreas } from '../actions/reference-data.actions';
import { getCPSAreas, ReferenceDataState } from '../reducers/index';
import { CPSArea } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cps-area-select',
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
      useExisting: forwardRef(() => CPSAreaSelectComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => CPSAreaSelectComponent)
    }
  ],
  imports: [PdkSelectComponent, AsyncPipe]
})
export class CPSAreaSelectComponent implements OnInit, ControlValueAccessor, FormFieldControl {
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
      select(getCPSAreas),
      map((cpsAreas) => {
        if (cpsAreas) {
          return cpsAreas.map((cpsArea) => ({
            value: cpsArea.id,
            label: cpsArea.areaName
          }));
        }
        return [];
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getCPSAreas), take(1)).subscribe((cpsAreas) => {
        if (!cpsAreas) {
          this.store.dispatch(loadCPSAreas());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.selectRef.registerOnChange((cpsAreaId?: string) => {
      this.store
        .pipe(
          select(getCPSAreas),
          take(1),
          map((cpsAreas) => {
            if (cpsAreas) {
              return cpsAreas.find(({ id }) => id === cpsAreaId);
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

  writeValue(value?: CPSArea) {
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
