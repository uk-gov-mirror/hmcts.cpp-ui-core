import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PdkAutosuggestLiteComponent } from '@cpp/pdk';
import { provideStore, Store } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { provideReferenceDataStore } from '../../providers';
import { ReferenceDataState } from '../../reducers';
import { CourtApplicationType } from '../../reference-data.interfaces';
import { ReferenceDataService } from '../../services/reference-data.service';
import { ApplicationTypeStandaloneAutosuggestComponent } from '../application-type-standalone.autosuggest';

describe('ApplicationTypeStandaloneAutosuggestComponent', () => {
  let fixture: ComponentFixture<ApplicationTypeStandaloneAutosuggestTestComponent>;
  let searchApplicationTypes: jest.Mock;
  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    searchApplicationTypes = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        provideStore({}),
        provideReferenceDataStore(),
        {
          provide: ReferenceDataService,
          useValue: {
            searchApplicationTypes
          }
        }
      ]
    });

    fixture = TestBed.overrideComponent(ApplicationTypeStandaloneAutosuggestComponent, {
      remove: {
        imports: [PdkAutosuggestLiteComponent]
      },
      add: {
        imports: [MockAutosuggestLiteComponent]
      }
    }).createComponent(ApplicationTypeStandaloneAutosuggestTestComponent);
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
        By.directive(MockAutosuggestLiteComponent)
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
    <cpp-application-type-standalone-autosuggest
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [debounceTime]="debounceTime"
      [hasError]="hasError"
      [highlightFirstSuggestion]="highlightFirstSuggestion"
      [highlightMatchedText]="highlightMatchedText"
      [id]="id"
      [inputWidth]="inputWidth"
      [maxResults]="maxResults"
      (inputText)="inputText($event)"
    >
    </cpp-application-type-standalone-autosuggest>
  `,
  imports: [ApplicationTypeStandaloneAutosuggestComponent]
})
class ApplicationTypeStandaloneAutosuggestTestComponent {
  ariaDescribedBy = 'ariaDescribedBy';
  ariaLabel = 'ariaLabel';
  ariaLabelledBy = 'ariaLabelledBy';
  debounceTime = 150;
  hasError = false;
  highlightFirstSuggestion = false;
  highlightMatchedText = false;
  id = 'id';
  inputText = jest.fn();
  inputWidth = 4;
  maxResults = 10;
}

@Component({
  selector: 'pdk-autosuggest-lite',
  template: ``
})
class MockAutosuggestLiteComponent {
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
