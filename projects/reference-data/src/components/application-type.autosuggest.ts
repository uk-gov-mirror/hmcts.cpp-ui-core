import { HttpErrorResponse } from '@angular/common/http';
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
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  map,
  startWith,
  switchMap,
  switchMapTo,
  take,
  tap
} from 'rxjs/operators';
import { loadApplicationTypes } from '../actions/reference-data.actions';
import {
  getApplicationTypes,
  getApplicationTypesFetching,
  ReferenceDataState
} from '../reducers/index';
import { CourtApplicationType } from '../reference-data.interfaces';
import { ReferenceDataService } from '../services/reference-data.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-application-type-autosuggest',
  template: `
    <pdk-autosuggest-lite
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [hasError]="hasError"
      [highlightFirstSuggestion]="highlightFirstSuggestion"
      [highlightMatchedText]="highlightMatchedText"
      [id]="id"
      [inputWidth]="inputWidth"
      (inputText)="search$.next($event)"
      [suggestions]="suggestions$ | async"
      [suggestionKey]="suggestionKey"
      [suggestionTitle]="suggestionTitle"
      [suggestionSubtitle]="suggestionSubtitle"
    >
    </pdk-autosuggest-lite>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApplicationTypeAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => ApplicationTypeAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestLiteComponent, AsyncPipe]
})
export class ApplicationTypeAutosuggestComponent<T extends CourtApplicationType>
  implements OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() debounceTime = 250;
  @Input() fetchOptionsOnMount = false;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText = true;
  @Input() filterBy?: (applicationType: CourtApplicationType) => boolean;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Input() search = false;
  @Output() error = new EventEmitter<any>();
  @ViewChild(PdkAutosuggestLiteComponent, { static: true })
  autosuggestLiteRef!: PdkAutosuggestLiteComponent<T>;
  fetchingApplicationTypes$: Observable<boolean>;
  search$ = new Subject<string>();
  searching$ = new BehaviorSubject(false);
  suggestions$: Observable<CourtApplicationType[]>;
  suggestionKey: keyof CourtApplicationType = 'id';
  suggestionTitle: keyof CourtApplicationType = 'type';
  suggestionSubtitle: keyof CourtApplicationType = 'code';
  constructor(
    private referenceData: ReferenceDataService,
    private store: Store<ReferenceDataState>
  ) {
    this.fetchingApplicationTypes$ = this.store.pipe(select(getApplicationTypesFetching));
    this.suggestions$ = this.search$.pipe(
      map((q) => q.toLowerCase()),
      switchMap((q) => {
        if (q.length !== 0) {
          if (this.search) {
            return of(q).pipe(
              tap(() => this.searching$.next(true)),
              delay(this.debounceTime),
              switchMap(() =>
                this.referenceData.searchApplicationTypes({
                  q,
                  limit: this.maxResults
                })
              ),
              tap({
                error: (error: HttpErrorResponse) => this.error.emit(error)
              }),
              catchError(() => of([])),
              tap(() => this.searching$.next(false))
            );
          }
          return this.store.pipe(
            select(getApplicationTypes),
            take(1),
            tap((applicationTypes) => {
              if (applicationTypes === undefined) {
                this.store.dispatch(loadApplicationTypes());
              }
            }),
            switchMapTo(this.store),
            select(getApplicationTypes),
            filter((applicationTypes) => applicationTypes !== null),
            take(1),
            map((applicationTypes) => {
              if (applicationTypes) {
                const filterBy = this.filterBy || (() => true);
                return applicationTypes.filter((applicationType) => {
                  const { type, code } = applicationType;
                  const hasKeyWord =
                    type.toLowerCase().includes(q) || (code || '').toLowerCase().includes(q);
                  return hasKeyWord && filterBy(applicationType);
                });
              }
              return [];
            }),
            map((applicationTypes) => applicationTypes.slice(0, Math.max(this.maxResults, 10)))
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount && !this.search) {
      this.store.dispatch(loadApplicationTypes());
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

  writeValue(value?: T) {
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
