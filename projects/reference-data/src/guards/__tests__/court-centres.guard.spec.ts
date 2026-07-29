import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { OrganisationUnitsGuard } from '../court-centres.guard';

describe('OrganisationUnitsGuard', () => {
  let guard: OrganisationUnitsGuard;
  let store: Store<ReferenceDataState>;

  let fetchOrganisationUnits: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchOrganisationUnits = jest.fn();
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
        OrganisationUnitsGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchOrganisationUnits
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

    guard = TestBed.inject(OrganisationUnitsGuard);
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

  it('should resolve to true when the court centres exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadOrganisationUnitsSuccess({ organisationUnits: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching court centres from the server when not found in the store', () => {
    expect.assertions(3);
    const snapshot = createSnapshot();

    fetchOrganisationUnits.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(fetchOrganisationUnits).toHaveBeenCalledWith(false);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadOrganisationUnitsSuccess({ organisationUnits: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the court centres', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchOrganisationUnits.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
