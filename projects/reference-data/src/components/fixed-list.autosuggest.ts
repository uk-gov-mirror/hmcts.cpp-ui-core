import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
  Type
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import {
  PdkAutosuggestComponent,
  FormFieldControl,
  InputWidth,
  PdkTypographyDirective
} from '@cpp/pdk';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { loadFixedLists } from '../actions/reference-data.actions';
import { getFixedLists, getFixedListsFetching, ReferenceDataState } from '../reducers/index';
import { FixedList } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-fixed-list-autosuggest',
  template: `
    <pdk-autosuggest
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [hasError]="hasError"
      highlightColor="blue"
      [highlightFirstSuggestion]="highlightFirstSuggestion"
      [id]="id"
      [inputWidth]="inputWidth"
      (inputText)="search$.next($event)"
      [mapSuggestionToKey]="getKey"
      [mapSuggestionToLabel]="getLabel"
      [suggestions]="suggestions$ | async"
      [suggestionTemplateRef]="suggestionTemplateRef"
    >
    </pdk-autosuggest>
    <ng-template
      #suggestionTemplateRef
      let-highlighted="highlighted"
      let-matchText="matchText"
      let-suggestion="suggestion"
    >
      <span pdk-typography="body-small">
        @for (element of suggestion.elements; track element.code) {
        {{ element.code }}
        }
      </span>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FixedListAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => FixedListAutosuggestComponent)
    }
  ],
  imports: [PdkAutosuggestComponent, AsyncPipe, PdkTypographyDirective]
})
export class FixedListAutosuggestComponent
  implements OnInit, ControlValueAccessor, FormFieldControl
{
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() fetchOptionsOnMount = false;
  @Input() hasError = false;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() id!: string;
  @Input() inputWidth?: InputWidth;
  @Input() maxResults = 6;
  @Output() error = new EventEmitter<any>();

  @ViewChild(PdkAutosuggestComponent, { static: true }) autosuggestRef!: PdkAutosuggestComponent;

  fetching$: Observable<boolean>;
  search$ = new Subject<string>();
  suggestions$: Observable<FixedList[]>;

  controlType = 'autosuggest';
  inputValue = '';
  multi = false;

  get ngControl() {
    return this.injector.get(NgControl as Type<NgControl>);
  }

  constructor(private store: Store<ReferenceDataState>, private injector: Injector) {
    this.fetching$ = this.store.pipe(select(getFixedListsFetching));

    this.suggestions$ = this.search$.pipe(
      switchMap((q) => {
        if (q.length !== 0) {
          return this.store.pipe(
            select(getFixedLists),
            take(1),
            tap((fixedLists) => {
              if (fixedLists.length === 0) {
                this.store.dispatch(loadFixedLists());
              }
            }),
            switchMapTo(this.store),
            select(getFixedLists),
            filter((fixedLists) => fixedLists.length > 0),
            take(1),
            map((fixedLists) => {
              if (fixedLists) {
                const term = q.toLowerCase();

                return fixedLists.filter(({ elements }) =>
                  elements.some(
                    ({ code, value }) =>
                      code.toLowerCase().includes(term) || value.toLowerCase().includes(term)
                  )
                );
              }
              return [];
            }),
            map((fixedLists) => fixedLists.slice(0, Math.max(this.maxResults, 10)))
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.dispatch(loadFixedLists());
    }
  }

  getKey(fixedList: FixedList) {
    return fixedList.id;
  }

  getLabel() {
    return '';
  }

  // ControlValueAccessor forwarding

  propagateChange: (_: any) => void = (fn: any) => {
    this.autosuggestRef.propagateChange(fn);
  };

  registerOnChange(fn: (_: any) => void): void {
    this.autosuggestRef.registerOnChange(fn);
  }

  registerOnTouched(fn: any) {
    this.autosuggestRef.registerOnTouched(fn);
  }

  writeValue(value?: FixedList) {
    this.autosuggestRef.writeValue(value);
  }
}
