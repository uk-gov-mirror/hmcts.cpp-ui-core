import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PdkAutosuggestLiteComponent, FormFieldControl, InputWidth } from '@cpp/pdk';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, delay, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { CourtApplicationType } from '../reference-data.interfaces';
import { ReferenceDataService } from '../services/reference-data.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-application-type-standalone-autosuggest',
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
      useExisting: forwardRef(() => ApplicationTypeStandaloneAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => ApplicationTypeStandaloneAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestLiteComponent, AsyncPipe]
})
export class ApplicationTypeStandaloneAutosuggestComponent<T extends CourtApplicationType>
  implements ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() debounceTime = 250;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText = true;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Input() filterBy: (applicationType: CourtApplicationType) => boolean = () => true;
  @Output() error = new EventEmitter<any>();
  @ViewChild(PdkAutosuggestLiteComponent, { static: true })
  autosuggestLiteRef!: PdkAutosuggestLiteComponent<T>;
  search$ = new Subject<string>();
  searching$ = new BehaviorSubject(false);
  suggestions$: Observable<CourtApplicationType[]>;
  suggestionKey: keyof CourtApplicationType = 'id';
  suggestionTitle: keyof CourtApplicationType = 'type';
  suggestionSubtitle: keyof CourtApplicationType = 'code';

  constructor(private referenceData: ReferenceDataService) {
    this.suggestions$ = this.search$.pipe(
      filter((search) => !!search && search.trim().length > 2),
      map((search) => search.toLowerCase()),
      switchMap((search) =>
        of(search).pipe(
          tap(() => this.searching$.next(true)),
          delay(this.debounceTime),
          switchMap(() =>
            this.referenceData
              .searchApplicationStandAloneTypes({
                search,
                limit: this.maxResults
              })
              .pipe(map((appTypes) => appTypes.filter(this.filterBy)))
          ),
          tap({
            error: (error: HttpErrorResponse) => this.error.emit(error)
          }),
          catchError(() => of([])),
          tap(() => this.searching$.next(false))
        )
      ),
      startWith([])
    );
  }

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
