import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { CourtApplicationType } from '../../reference-data.interfaces';
import { ReferenceDataService } from '../../services/reference-data.service';
import { ApplicationTypeAutosuggestComponent } from '../application-type.autosuggest';
import { PdkAutosuggestLiteComponent } from '@cpp/pdk';

describe('ApplicationTypeAutosuggestComponent', () => {
  let fixture: ComponentFixture<ApplicationTypeAutosuggestTestComponent>;
  let searchApplicationTypes: jest.Mock;
  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    searchApplicationTypes = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot(() => null, {
          runtimeChecks: {}
        }),
        StoreModule.forFeature('referenceData', referenceDataReducer),
        ApplicationTypeAutosuggestComponent
      ],
      declarations: [ApplicationTypeAutosuggestTestComponent],
      providers: [
        {
          provide: ReferenceDataService,
          useValue: {
            searchApplicationTypes
          }
        }
      ]
    });

    TestBed.overrideComponent(ApplicationTypeAutosuggestComponent, {
      remove: {
        imports: [PdkAutosuggestLiteComponent]
      },
      add: {
        imports: [AutosuggestLiteMockComponent]
      }
    });

    fixture = TestBed.createComponent(ApplicationTypeAutosuggestTestComponent);
    fixture.detectChanges();

    store = TestBed.inject(Store);
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when application types are read locally', () => {
    it('should filter application types found in the store', () => {
      store.dispatch(
        ReferenceDataActions.loadApplicationTypesSuccess({
          applicationTypes: [{ type: 'Foo' }, { code: 'Bar' }] as CourtApplicationType[]
        })
      );
      const autosuggestLiteRef = fixture.debugElement.query(
        By.directive(AutosuggestLiteMockComponent)
      );

      autosuggestLiteRef.componentInstance.inputText.emit('b');

      expect(fixture).toMatchSnapshot();
    });

    it('should dispatch an action to fetch application types from the store', () => {});
  });
});

@Component({
  selector: 'cpp-application-type-autosuggest-test',
  template: `
    <cpp-application-type-autosuggest
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [debounceTime]="debounceTime"
      [fetchOptionsOnMount]="fetchOptionsOnMount"
      [hasError]="hasError"
      [highlightFirstSuggestion]="highlightFirstSuggestion"
      [highlightMatchedText]="highlightMatchedText"
      [id]="id"
      [inputWidth]="inputWidth"
      [maxResults]="maxResults"
      [search]="search"
      (inputText)="inputText($event)"
    >
    </cpp-application-type-autosuggest>
  `,
  standalone: false
})
class ApplicationTypeAutosuggestTestComponent {
  ariaDescribedBy = 'ariaDescribedBy';
  ariaLabel = 'ariaLabel';
  ariaLabelledBy = 'ariaLabelledBy';
  debounceTime = 150;
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
