import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { provideStore, Store } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { WitnessCareUnit } from '../../reference-data.interfaces';
import { ReferenceDataService } from '../../services/reference-data.service';
import { WitnessCareUnitSelectComponent } from '../witness-care-unit.select';

let reset: jest.Mock;

describe('WitnessCareUnitSelectComponent', () => {
  let fixture: ComponentFixture<WitnessCareUnitSelectComponentTestComponent>;
  let fetchWitnessCareUnits: jest.Mock;

  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchWitnessCareUnits = jest.fn();
    reset = jest.fn();

    TestBed.configureTestingModule({
      imports: [WitnessCareUnitSelectComponent],
      declarations: [WitnessCareUnitSelectComponentTestComponent],
      providers: [
        provideStore({ referenceData: referenceDataReducer }, { runtimeChecks: {} }),
        {
          provide: ReferenceDataService,
          useValue: {
            fetchWitnessCareUnits
          }
        }
      ]
    });
    TestBed.overrideComponent(WitnessCareUnitSelectComponent, {
      remove: {
        imports: [PdkSelectComponent]
      },
      add: {
        imports: [SelectTestComponent]
      }
    });
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(WitnessCareUnitSelectComponentTestComponent);
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when witnessCareUnits are present in the store ', () => {
    beforeEach(() => {
      store.dispatch(
        ReferenceDataActions.loadWitnessCareUnitsSuccess({
          witnessCareUnits: [
            { id: 'id1', wcuName: 'Manchester', wcuCode: 'wcuCode1', policeForceCode: '22' },
            { id: 'id2', wcuName: 'Bristol', wcuCode: 'wcuCode2', policeForceCode: '36' }
          ] as WitnessCareUnit[]
        })
      );
    });

    it('should render options filtered by cps area code, and reset ngControl on the select input', () => {
      fixture.componentInstance.policeForceCode = '36';
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
      expect(reset).toHaveBeenCalledTimes(1);
    });

    it('should clear previously rendered options if cps area code is changed to a falsy value', () => {
      fixture.componentInstance.policeForceCode = '28';
      fixture.detectChanges();
      fixture.componentInstance.policeForceCode = undefined;
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });

  describe('when witnessCareUnits are not present in the store ', () => {
    it('should dispatch an action to load witness care units', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ReferenceDataActions.loadWitnessCareUnits());
    });
  });
});

@Component({
  selector: 'witness-care-unit-select-test',
  template: `
    <witness-care-unit-select
      [ariaDescribedBy]="ariaDescribedBy"
      [policeForceCode]="policeForceCode"
      [disabled]="disabled"
      [fetchOptionsOnMount]="fetchOptionsOnMount"
      [id]="id"
      [justified]="justified"
      [name]="name"
      [placeholder]="placeholder"
      [required]="required"
      (change)="change($event)"
    >
    </witness-care-unit-select>
  `,
  standalone: false
})
class WitnessCareUnitSelectComponentTestComponent {
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
  providers: [
    {
      provide: PdkSelectComponent,
      useClass: SelectTestComponent
    }
  ],
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
