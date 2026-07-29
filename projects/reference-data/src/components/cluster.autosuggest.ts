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
import { loadClusters } from '../actions/reference-data.actions';
import { getClusters, getClustersFetching, ReferenceDataState } from '../reducers/index';
import { Cluster } from '../reference-data.interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'cpp-cluster-autosuggest',
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
      useExisting: forwardRef(() => ClusterAutosuggestComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => ClusterAutosuggestComponent)
    }
  ],
  imports: [AsyncPipe, PdkAutosuggestLiteComponent]
})
export class ClusterAutosuggestComponent<T extends Cluster>
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
  suggestions$: Observable<Cluster[]>;
  suggestionKey: keyof Cluster = 'id';
  suggestionTitle: keyof Cluster = 'clusterName';

  constructor(private store: Store<ReferenceDataState>) {
    this.fetching$ = this.store.pipe(select(getClustersFetching));

    this.suggestions$ = this.search$.pipe(
      switchMap((q) => {
        if (q.length !== 0) {
          return this.store.pipe(
            select(getClusters),
            take(1),
            tap((clusters) => {
              if (clusters === undefined) {
                this.store.dispatch(loadClusters());
              }
            }),
            switchMapTo(this.store),
            select(getClusters),
            filter((clusters) => clusters !== null),
            take(1),
            map((clusters) => {
              if (clusters) {
                const term = q.toLowerCase();

                return clusters.filter(
                  ({ clusterCode, clusterName }) =>
                    clusterCode.toLowerCase().includes(term) ||
                    clusterName.toLowerCase().includes(term)
                );
              }
              return [];
            }),
            map((clusters) => clusters.slice(0, Math.max(this.maxResults, 10)))
          );
        }
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    if (this.fetchOptionsOnMount) {
      this.store.dispatch(loadClusters());
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
