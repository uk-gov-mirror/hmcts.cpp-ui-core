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
import { loadPoliceRanks } from '../actions/reference-data.actions';
import { getPoliceRanks, ReferenceDataState } from '../reducers/index';
import { PoliceRank } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-police-ranks-select',
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
      useExisting: forwardRef(() => PoliceRanksSelectComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => PoliceRanksSelectComponent)
    }
  ],
  imports: [PdkSelectComponent, AsyncPipe]
})
export class PoliceRanksSelectComponent implements OnInit, ControlValueAccessor, FormFieldControl {
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
      select(getPoliceRanks),
      map((policeRanks) => {
        if (policeRanks) {
          return policeRanks.map((policeRank) => ({
            value: policeRank.rankCode,
            label: policeRank.rankDescription
          }));
        }
        return [];
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.pipe(select(getPoliceRanks), take(1)).subscribe((policeRanks) => {
        if (!policeRanks.length) {
          this.store.dispatch(loadPoliceRanks());
        }
      });
    }
  }

  registerOnChange = (fn: (_: any) => void): void => {
    this.selectRef.registerOnChange((code?: string) => {
      this.store
        .pipe(
          select(getPoliceRanks),
          take(1),
          map((policeRanks) => {
            if (policeRanks) {
              return policeRanks.find(({ rankCode }) => rankCode === code);
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

  writeValue(value?: PoliceRank) {
    this.selectRef.writeValue(value ? value.rankCode : undefined);
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
