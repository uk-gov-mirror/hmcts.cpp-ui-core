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
import { loadPoliceForceList } from '../actions/reference-data.actions';
import { getPoliceForceList, getPoliceForceFetching, ReferenceDataState } from '../reducers/index';
import { PoliceForce } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'police-force-autosuggest',
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
    >
    </pdk-autosuggest-lite>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoliceForceAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => PoliceForceAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestLiteComponent, AsyncPipe]
})
export class PoliceForceAutosuggestComponent<T extends PoliceForce>
  implements OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() fetchOptionsOnMount = false;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText = true;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Output() error = new EventEmitter<any>();

  @ViewChild(PdkAutosuggestLiteComponent, { static: true })
  autosuggestLiteRef!: PdkAutosuggestLiteComponent<T>;

  fetching$: Observable<boolean>;
  search$ = new Subject<string>();
  suggestions$: Observable<PoliceForce[]>;
  suggestionKey: keyof PoliceForce = 'id';
  suggestionTitle: keyof PoliceForce = 'policeForceName';

  constructor(private store: Store<ReferenceDataState>) {
    this.fetching$ = this.store.pipe(select(getPoliceForceFetching));

    this.suggestions$ = this.search$.pipe(
      switchMap((q) => {
        if (q.length !== 0) {
          return this.store.pipe(
            select(getPoliceForceList),
            take(1),
            tap((policeForceList) => {
              if (policeForceList === undefined) {
                this.store.dispatch(loadPoliceForceList());
              }
            }),
            switchMapTo(this.store),
            select(getPoliceForceList),
            filter((policeForceList) => policeForceList !== null),
            take(1),
            map((policeForceList) => {
              if (policeForceList) {
                const term = q.toLowerCase();

                return policeForceList.filter(
                  ({ policeForceCode, policeForceName }) =>
                    policeForceCode.toLowerCase().includes(term) ||
                    policeForceName.toLowerCase().includes(term)
                );
              }
              return [];
            }),
            map((policeForceList) => policeForceList.slice(0, Math.max(this.maxResults, 10)))
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.dispatch(loadPoliceForceList());
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
