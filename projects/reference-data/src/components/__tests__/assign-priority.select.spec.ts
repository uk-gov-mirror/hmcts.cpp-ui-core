import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { Store, StoreModule } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { ReferenceDataService } from '../../services/reference-data.service';
import { AssignPrioritySelectComponent } from '../assign-priority.select';

let reset: jest.Mock;

describe('AssignPrioritySelectComponent', () => {
  let fixture: ComponentFixture<AssignPrioritySelectComponentTestComponent>;
  let fetchAssignPriorities: jest.Mock;

  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchAssignPriorities = jest.fn();
    reset = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot(() => null, {
          runtimeChecks: {}
        }),
        StoreModule.forFeature('referenceData', referenceDataReducer),
        AssignPrioritySelectComponent
      ],
      declarations: [AssignPrioritySelectComponentTestComponent],
      providers: [
        {
          provide: ReferenceDataService,
          useValue: {
            fetchAssignPriorities
          }
        }
      ]
    });

    TestBed.overrideComponent(AssignPrioritySelectComponent, {
      remove: {
        imports: [PdkSelectComponent]
      },
      add: {
        imports: [SelectTestComponent]
      }
    });
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(AssignPrioritySelectComponentTestComponent);
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when assignPriorities are not present in the store ', () => {
    it('should dispatch an action to load assign priorities', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ReferenceDataActions.loadAssignPriorities());
    });
  });
});

@Component({
  selector: 'assign-priority-select-test',
  template: `
    <assign-priority-select
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
    </assign-priority-select>
  `,
  standalone: false
})
class AssignPrioritySelectComponentTestComponent {
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
  selector: 'pdk-select',
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
