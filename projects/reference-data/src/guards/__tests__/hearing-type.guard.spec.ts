import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { HearingTypesGuard } from '../hearing-type.guard';

describe('HearingTypesGuard', () => {
  let guard: HearingTypesGuard;
  let store: Store<ReferenceDataState>;

  let fetchHearingTypes: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchHearingTypes = jest.fn();
    navigateByUrl = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            referenceData: referenceDataReducer
          },
          {
            runtimeChecks: {}
          }
        )
      ],
      providers: [
        HearingTypesGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchHearingTypes
          }
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl
          }
        }
      ]
    });

    guard = TestBed.inject(HearingTypesGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const createSnapshot = (referenceDataErrorRedirectTo = '') => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      referenceDataErrorRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the hearing types exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadHearingTypesSuccess({ hearingTypes: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching hearing types from the server when not found in the store', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchHearingTypes.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadHearingTypesSuccess({ hearingTypes: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the hearing types', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchHearingTypes.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
