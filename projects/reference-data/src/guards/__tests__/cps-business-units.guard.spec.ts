import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { CPSBusinessUnitsGuard } from '../cps-business-units.guard';

describe('CPSBusinessUnitsGuard', () => {
  let guard: CPSBusinessUnitsGuard;
  let store: Store<ReferenceDataState>;

  let fetchCPSBusinessUnits: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchCPSBusinessUnits = jest.fn();
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
        CPSBusinessUnitsGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchCPSBusinessUnits
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

    guard = TestBed.inject(CPSBusinessUnitsGuard);
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

  it('should resolve to true when the cps business units exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadCPSBusinessUnitsSuccess({ cpsBusinessUnits: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching cps business units from the server when not found in the store', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchCPSBusinessUnits.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadCPSBusinessUnitsSuccess({ cpsBusinessUnits: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the cps business units', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchCPSBusinessUnits.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
