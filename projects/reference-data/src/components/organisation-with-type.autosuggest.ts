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
import { delay, filter, map, startWith, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { loadOrganisationsWithType } from '../actions/reference-data.actions';
import {
  getOrganisationsWithType,
  getOrganisationsWithTypeNeedsFetching,
  ReferenceDataState
} from '../reducers/index';
import {
  OrganisationType,
  OrganisationWithType,
  OrganisationWithTypeAddress
} from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-organisation-with-type-autosuggest',
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
      [mapSuggestionToSubtitle]="mapSuggestionToSubtitle"
    >
    </pdk-autosuggest-lite>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrganisationWithTypeAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => OrganisationWithTypeAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestLiteComponent, AsyncPipe]
})
export class OrganisationWithTypeAutosuggestComponent
  implements OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() fetchOptionsOnMount = false;
  @Input() debounceTime = 250;
  @Input() filterBy?: (organisationWithType: OrganisationWithType) => boolean;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText = true;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Input() placeholder?: OrganisationWithType;
  @Input() orgType!: OrganisationType;
  @Output() error = new EventEmitter<any>();

  @ViewChild(PdkAutosuggestLiteComponent, { static: true })
  autosuggestLiteRef!: PdkAutosuggestLiteComponent<OrganisationWithType>;

  search$ = new Subject<string>();
  suggestions$: Observable<OrganisationWithType[]>;
  suggestionKey: keyof OrganisationWithType = 'id';
  suggestionTitle: keyof OrganisationWithType = 'orgName';
  disabled = false;
  addresses: (keyof OrganisationWithTypeAddress)[] = [
    'address1',
    'address2',
    'address3',
    'address4',
    'address5',
    'postcode'
  ];
  mapSuggestionToSubtitle = (suggestion: OrganisationWithType) =>
    this.addresses
      .filter((field) => !!suggestion[field])
      .map((existingField) => suggestion[existingField]?.trim())
      .join(', ');

  constructor(private store: Store<ReferenceDataState>) {
    this.suggestions$ = this.search$.pipe(
      delay(this.debounceTime),
      map((q) => q.toLowerCase()),
      switchMap((q) => {
        if (q.length !== 0) {
          return this.store.pipe(
            select(getOrganisationsWithTypeNeedsFetching),
            take(1),
            tap((needsFetching) => {
              if (needsFetching && !!this.orgType) {
                this.store.dispatch(loadOrganisationsWithType({ organisationType: this.orgType }));
              }
            }),
            switchMapTo(this.store),
            select(getOrganisationsWithType),
            filter((organisationsWithType) => organisationsWithType !== null),
            take(1),
            map((organisationsWithType) => {
              if (!organisationsWithType || organisationsWithType.length === 0) {
                return [];
              }

              const filterBy = this.filterBy || (() => true);
              const items = this.placeholder
                ? [this.placeholder, ...organisationsWithType]
                : organisationsWithType;

              return items.filter(
                (item) => filterBy(item) && item.orgName.toLowerCase().includes(q)
              );
            }),
            map((organisationsWithType) =>
              organisationsWithType.slice(0, Math.max(this.maxResults, 10))
            )
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount && !!this.orgType) {
      this.store.dispatch(loadOrganisationsWithType({ organisationType: this.orgType }));
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

  writeValue(value?: OrganisationWithType) {
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
