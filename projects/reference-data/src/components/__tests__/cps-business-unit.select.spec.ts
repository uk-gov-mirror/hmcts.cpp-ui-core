import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { Store, StoreModule } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { CPSBusinessUnit } from '../../reference-data.interfaces';
import { ReferenceDataService } from '../../services/reference-data.service';
import { CPSBusinessUnitSelectComponent } from '../cps-business-unit.select';

let reset: jest.Mock;

describe('CPSBusinessUnitSelectComponent', () => {
  let fixture: ComponentFixture<CPSBusinessUnitSelectComponentTestComponent>;
  let fetchCPSBusinessUnits: jest.Mock;

  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchCPSBusinessUnits = jest.fn();
    reset = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(() => null, {
          runtimeChecks: {}
        }),
        StoreModule.forFeature('referenceData', referenceDataReducer),
        CPSBusinessUnitSelectComponent
      ],
      declarations: [CPSBusinessUnitSelectComponentTestComponent],
      providers: [
        {
          provide: ReferenceDataService,
          useValue: {
            fetchCPSBusinessUnits
          }
        }
      ]
    });

    TestBed.overrideComponent(CPSBusinessUnitSelectComponent, {
      remove: {
        imports: [PdkSelectComponent]
      },
      add: {
        imports: [SelectTestComponent]
      }
    });

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(CPSBusinessUnitSelectComponentTestComponent);
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when cps business types are present in the store ', () => {
    beforeEach(() => {
      store.dispatch(
        ReferenceDataActions.loadCPSBusinessUnitsSuccess({
          cpsBusinessUnits: [
            { id: '1', cmsAreaCode: 1, unitCode: 1, unitName: 'Unit 1' },
            { id: '2', cmsAreaCode: 1, unitCode: 2, unitName: 'Unit 2' },
            { id: '3', cmsAreaCode: 2, unitCode: 3, unitName: 'Unit 3' }
          ] as CPSBusinessUnit[]
        })
      );
    });

    it('should render options filtered by cps area code, and reset ngControl on the select input', () => {
      fixture.componentInstance.cmsAreaCode = '1';
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
      expect(reset).toHaveBeenCalledTimes(1);
    });

    it('should clear previously rendered options if cps area code is changed to a falsy value', () => {
      fixture.componentInstance.cmsAreaCode = '2';
      fixture.detectChanges();
      fixture.componentInstance.cmsAreaCode = undefined;
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });

  describe('when cps business types are not present in the store ', () => {
    it('should dispatch an action to load cps business units', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ReferenceDataActions.loadCPSBusinessUnits());
    });
  });
});

@Component({
  selector: 'cpp-business-unit-select-test',
  template: `
    <cps-business-unit-select
      [ariaDescribedBy]="ariaDescribedBy"
      [cmsAreaCode]="cmsAreaCode"
      [disabled]="disabled"
      [fetchOptionsOnMount]="fetchOptionsOnMount"
      [id]="id"
      [justified]="justified"
      [name]="name"
      [placeholder]="placeholder"
      [required]="required"
      (change)="change($event)"
    >
    </cps-business-unit-select>
  `,
  standalone: false
})
class CPSBusinessUnitSelectComponentTestComponent {
  ariaDescribedBy = 'ariaDescribedBy';
  disabled = false;
  cmsAreaCode: string | undefined = undefined;
  fetchOptionsOnMount = true;
  id = 'id';
  justified = true;
  name = 'name';
  placeholder = 'placeholder';
  required = false;
  change = jest.fn();
}

@Component({
  selector: '<pdk-select>',
  template: ` {{ options | json }} `,
  imports: [JsonPipe],
  providers: [
    {
      provide: PdkSelectComponent,
      useExisting: SelectTestComponent
    }
  ]
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
