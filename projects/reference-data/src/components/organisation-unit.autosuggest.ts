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
import { PdkAutosuggestLiteComponent, FormFieldControl, InputWidth } from '@cpp/pdk';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { loadOrganisationUnits } from '../actions/reference-data.actions';
import {
  getOrganisationUnits,
  getOrganisationUnitsFetching,
  ReferenceDataState
} from '../reducers/index';
import { OrganisationUnit } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-organisation-unit-autosuggest',
  template: `
    <pdk-autosuggest-lite
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [disabled]="disabled"
      [hasError]="hasError"
      [highlightFirstSuggestion]="highlightFirstSuggestion"
      [highlightMatchedText]="highlightMatchedText"
      [id]="id"
      [inputWidth]="inputWidth"
      (inputText)="search$.next($event)"
      [suggestions]="suggestions$ | async"
      [suggestionKey]="suggestionKey"
      [suggestionTitle]="suggestionTitle"
    >
    </pdk-autosuggest-lite>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrganisationUnitAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => OrganisationUnitAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestLiteComponent, AsyncPipe]
})
export class OrganisationUnitAutosuggestComponent
  implements OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() fetchOptionsOnMount = false;
  @Input() filterBy?: (organisationUnit: OrganisationUnit) => boolean;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText = true;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Input() placeholder?: OrganisationUnit;
  @Input() jurisdictionCode?: 'B' | 'C';
  @Output() error = new EventEmitter<any>();

  @ViewChild(PdkAutosuggestLiteComponent, { static: true })
  autosuggestLiteRef!: PdkAutosuggestLiteComponent<OrganisationUnit>;

  fetching$: Observable<boolean>;
  search$ = new Subject<string>();
  suggestions$: Observable<OrganisationUnit[]>;
  suggestionKey: keyof OrganisationUnit = 'id';
  suggestionTitle: keyof OrganisationUnit = 'oucodeL3Name';
  disabled = false;

  constructor(private store: Store<ReferenceDataState>) {
    this.fetching$ = this.store.pipe(select(getOrganisationUnitsFetching));

    this.suggestions$ = this.search$.pipe(
      map((q) => q.toLowerCase()),
      switchMap((q) => {
        if (q.length !== 0) {
          return this.store.pipe(
            select(getOrganisationUnits),
            take(1),
            tap((organisationUnits) => {
              if (organisationUnits === undefined) {
                this.store.dispatch(loadOrganisationUnits());
              }
            }),
            switchMapTo(this.store),
            select(getOrganisationUnits),
            filter((organisationUnits) => organisationUnits !== null),
            take(1),
            map((organisationUnits) => {
              if (organisationUnits) {
                const filterBy = this.filterBy || (() => true);
                const items = this.placeholder
                  ? [this.placeholder, ...organisationUnits]
                  : organisationUnits;

                return items.filter((item) => {
                  const matchesQuery =
                    filterBy(item) && item.oucodeL3Name.toLowerCase().includes(q);
                  if (this.jurisdictionCode) {
                    return this.jurisdictionCode === item.oucodeL1Code && matchesQuery;
                  }
                  return matchesQuery;
                });
              }
              return [];
            }),
            map((organisationUnits) => organisationUnits.slice(0, Math.max(this.maxResults, 10)))
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.dispatch(loadOrganisationUnits());
    }
  }

  // ControlValueAccessor forwarding

  propagateChange: (_: any) => void = (fn: any) => {
    this.autosuggestLiteRef.propagateChange(fn);
  };

  registerOnChange(fn: (_: any) => void): void {
    this.autosuggestLiteRef.registerOnChange(fn);
  }

  registerOnTouched(fn: any) {
    this.autosuggestLiteRef.registerOnTouched(fn);
  }

  writeValue(value?: OrganisationUnit) {
    this.autosuggestLiteRef.writeValue(value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // FormFieldControl forwarding

  get controlType() {
    return this.autosuggestLiteRef.controlType;
  }

  get multi() {
    if (this.autosuggestLiteRef) {
      return this.autosuggestLiteRef.multi;
    }

    return false;
  }

  get ngControl() {
    return this.autosuggestLiteRef.ngControl;
  }

  get controlRef() {
    return this.autosuggestLiteRef.controlRef;
  }
}
