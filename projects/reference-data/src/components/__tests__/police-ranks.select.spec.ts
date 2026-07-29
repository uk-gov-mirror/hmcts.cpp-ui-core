import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { Store, StoreModule } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { ReferenceDataService } from '../../services/reference-data.service';
import { PoliceRanksSelectComponent } from '../police-ranks.select';

let reset: jest.Mock;

describe('PoliceRanksSelectComponent', () => {
  let fixture: ComponentFixture<PoliceRanksSelectComponentTestComponent>;
  let fetchPoliceRanks: jest.Mock;

  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchPoliceRanks = jest.fn();
    reset = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot(() => null, {
          runtimeChecks: {}
        }),
        StoreModule.forFeature('referenceData', referenceDataReducer),
        PoliceRanksSelectComponent
      ],
      declarations: [PoliceRanksSelectComponentTestComponent],
      providers: [
        {
          provide: ReferenceDataService,
          useValue: {
            fetchPoliceRanks
          }
        }
      ]
    });
    TestBed.overrideComponent(PoliceRanksSelectComponent, {
      remove: {
        imports: [PdkSelectComponent]
      },
      add: {
        imports: [SelectTestComponent]
      }
    });
    store = TestBed.get(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(PoliceRanksSelectComponentTestComponent);
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when policeRanks are not present in the store ', () => {
    it('should dispatch an action to load police ranks', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ReferenceDataActions.loadPoliceRanks());
    });
  });
});

@Component({
  selector: 'cpp-police-ranks-select-test',
  template: `
    <cpp-police-ranks-select
      [ariaDescribedBy]="ariaDescribedBy"
      [disabled]="disabled"
      [fetchOptionsOnMount]="fetchOptionsOnMount"
      [id]="id"
      [justified]="justified"
      [name]="name"
      [placeholder]="placeholder"
      [required]="required"
      (change)="change($event)"
    >
    </cpp-police-ranks-select>
  `,
  standalone: false
})
class PoliceRanksSelectComponentTestComponent {
  ariaDescribedBy = 'ariaDescribedBy';
  disabled = false;
  fetchOptionsOnMount = true;
  id = 'id';
  justified = true;
  name = 'name';
  placeholder = 'placeholder';
  policeForceCode: string | undefined = undefined;
  required = false;
  change = jest.fn();
}

@Component({
  selector: '<pdk-select>',
  template: ` {{ options | json }} `,
  imports: [JsonPipe]
})
class SelectTestComponent {
  @Input() ariaDescribedBy?: string;
  @Input() disabled?: boolean;
  @Input() id?: string;
  @Input() justified?: string;
  @Input() name?: string;
  @Input() options?: SelectOption[];
  @Input() placeholder?: string;
  @Input() required?: boolean;

  ngControl = {
    reset
  };
}
