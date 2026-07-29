import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdkSelectComponent, SelectOption } from '@cpp/pdk';
import { Store, StoreModule } from '@ngrx/store';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers';
import { ReferenceDataService } from '../../services/reference-data.service';
import { BookingTypesSelectComponent } from '../booking-type.select';

let reset: jest.Mock;

describe('BookingTypesSelectComponent', () => {
  let fixture: ComponentFixture<BookingTypesSelectComponentTestComponent>;
  let fetchBookingTypes: jest.Mock;

  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchBookingTypes = jest.fn();
    reset = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot(() => null, {
          runtimeChecks: {}
        }),
        StoreModule.forFeature('referenceData', referenceDataReducer),
        BookingTypesSelectComponent
      ],
      declarations: [BookingTypesSelectComponentTestComponent],
      providers: [
        {
          provide: ReferenceDataService,
          useValue: {
            fetchBookingTypes
          }
        }
      ]
    });

    TestBed.overrideComponent(BookingTypesSelectComponent, {
      remove: {
        imports: [PdkSelectComponent]
      },
      add: {
        imports: [SelectTestComponent]
      }
    });

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(BookingTypesSelectComponentTestComponent);
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('when bookingTypes are not present in the store ', () => {
    it('should dispatch an action to load bookingTypes', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ReferenceDataActions.loadBookingTypes());
    });
  });
});

@Component({
  selector: 'booking-types-select-test',
  template: `
    <booking-types-select
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
    </booking-types-select>
  `,
  standalone: false
})
class BookingTypesSelectComponentTestComponent {
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
