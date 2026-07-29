import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { Cluster } from '../../reference-data.interfaces';
import { ReferenceDataService } from '../../services/reference-data.service';
import { ClusterAutosuggestComponent } from '../cluster.autosuggest';
import { PdkAutosuggestLiteComponent } from '@cpp/pdk';

describe('ClusterAutosuggestComponent', () => {
  let fixture: ComponentFixture<ClusterAutosuggestComponentTestComponent>;
  let fetchClusters: jest.Mock;
  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchClusters = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot(() => null, {
          runtimeChecks: {}
        }),
        StoreModule.forFeature('referenceData', referenceDataReducer),
        ClusterAutosuggestComponent
      ],
      declarations: [ClusterAutosuggestComponentTestComponent],
      providers: [
        {
          provide: ReferenceDataService,
          useValue: {
            fetchClusters
          }
        }
      ]
    });

    TestBed.overrideComponent(ClusterAutosuggestComponent, {
      remove: {
        imports: [PdkAutosuggestLiteComponent]
      },
      add: {
        imports: [AutosuggestLiteMockComponent]
      }
    });

    fixture = TestBed.createComponent(ClusterAutosuggestComponentTestComponent);

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when clusters are read locally', () => {
    it('should filter clusters found in the store', () => {
      store.dispatch(
        ReferenceDataActions.loadClustersSuccess({
          clusters: [{ clusterCode: 'Foo', clusterName: 'foo' }, { code: 'Bar' }] as Cluster[]
        })
      );
      const autosuggestLiteRef = fixture.debugElement.query(
        By.directive(AutosuggestLiteMockComponent)
      );

      autosuggestLiteRef.componentInstance.inputText.emit('b');

      expect(fixture).toMatchSnapshot();
    });
  });

  describe('when clusters are not present in the store ', () => {
    it('should dispatch an action to load clusters', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ReferenceDataActions.loadClusters());
    });
  });
});

@Component({
  selector: 'cpp-cluster-autosuggest-test',
  template: `
    <cpp-cluster-autosuggest
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [fetchOptionsOnMount]="fetchOptionsOnMount"
      [hasError]="hasError"
      [highlightFirstSuggestion]="highlightFirstSuggestion"
      [highlightMatchedText]="highlightMatchedText"
      [id]="id"
      [inputWidth]="inputWidth"
      [maxResults]="maxResults"
      (inputText)="inputText($event)"
    >
    </cpp-cluster-autosuggest>
  `,
  standalone: false
})
class ClusterAutosuggestComponentTestComponent {
  ariaDescribedBy = 'ariaDescribedBy';
  ariaLabel = 'ariaLabel';
  ariaLabelledBy = 'ariaLabelledBy';
  fetchOptionsOnMount = true;
  hasError = false;
  highlightFirstSuggestion = false;
  highlightMatchedText = false;
  id = 'id';
  inputText = jest.fn();
  inputWidth = 4;
  maxResults = 10;
  search = false;
}

@Component({
  selector: 'pdk-autosuggest-lite',
  template: ``
})
class AutosuggestLiteMockComponent {
  @Input() ariaDescribedBy?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() hasError?: boolean;
  @Input() highlightFirstSuggestion?: boolean;
  @Input() highlightMatchedText?: boolean;
  @Input() id?: string;
  @Input() inputWidth?: number;
  @Input() suggestions?: any[];
  @Input() suggestionKey?: string;
  @Input() suggestionTitle?: string;
  @Input() suggestionSubtitle?: string;
  @Output() inputText = new EventEmitter<string>();
}
