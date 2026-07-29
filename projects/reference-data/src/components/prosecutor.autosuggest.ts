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
import { loadProsecutors } from '../actions/reference-data.actions';
import { getProsecutors, getProsecutorsFetching, ReferenceDataState } from '../reducers/index';
import { Prosecutor } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-prosecutor-autosuggest',
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
      [mapSuggestionToTitle]="mapSuggestionToTitle"
    >
    </pdk-autosuggest-lite>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProsecutorAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => ProsecutorAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestLiteComponent, AsyncPipe]
})
export class ProsecutorAutosuggestComponent
  implements OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() fetchOptionsOnMount = false;
  @Input() filterBy?: (prosecutor: Prosecutor) => boolean;
  @Input() disabled = false;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText = true;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Output() error = new EventEmitter<any>();
  @Output() inputText = new EventEmitter<string>();

  @ViewChild(PdkAutosuggestLiteComponent, { static: true })
  autosuggestLiteRef!: PdkAutosuggestLiteComponent<Prosecutor>;

  fetching$: Observable<boolean>;
  search$ = new Subject<string>();
  suggestions$: Observable<Prosecutor[]>;
  suggestionKey: keyof Prosecutor = 'id';
  suggestionTitle: keyof Prosecutor = 'fullName';

  mapSuggestionToTitle = (suggestion: Prosecutor) => {
    if (!suggestion.standard) {
      const { fullName, address } = suggestion;
      if (address) {
        const { address1, postcode } = address;
        return `${fullName}, ${address1}, ${postcode}`;
      }
    }

    return suggestion.fullName;
  };

  constructor(private store: Store<ReferenceDataState>) {
    this.fetching$ = this.store.pipe(select(getProsecutorsFetching));

    this.suggestions$ = this.search$.pipe(
      tap((q) => this.inputText.next(q)),
      map((q) => q.toLowerCase()),
      switchMap((q) => {
        if (q.length !== 0) {
          return this.store.pipe(
            select(getProsecutors),
            take(1),
            tap((fetching) => {
              if (!fetching) {
                this.store.dispatch(loadProsecutors());
              }
            }),
            switchMapTo(this.store),
            select(getProsecutors),
            filter((prosecutors) => prosecutors !== null),
            take(1),
            map((prosecutors) => {
              if (prosecutors) {
                const filterBy = this.filterBy || (() => true);
                return prosecutors.filter(
                  (prosecutor) =>
                    filterBy(prosecutor) && prosecutor.fullName.toLowerCase().includes(q)
                );
              }
              return [];
            }),
            map((prosecutors) => prosecutors.slice(0, Math.max(this.maxResults, 10)))
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.dispatch(loadProsecutors());
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

  writeValue(value?: Prosecutor) {
    this.autosuggestLiteRef.writeValue(value);
  }

  // FormFieldControl forwarding

  get controlType() {
    return this.autosuggestLiteRef.controlType;
  }

  get multi() {
    return this.autosuggestLiteRef.multi;
  }

  get ngControl() {
    return this.autosuggestLiteRef.ngControl;
  }

  get controlRef() {
    return this.autosuggestLiteRef.controlRef;
  }
}
