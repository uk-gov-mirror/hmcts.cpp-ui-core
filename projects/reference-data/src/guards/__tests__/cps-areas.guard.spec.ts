import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { CPSAreasGuard } from '../cps-areas.guard';

describe('CPSAreasGuard', () => {
  let guard: CPSAreasGuard;
  let store: Store<ReferenceDataState>;

  let fetchCPSAreas: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchCPSAreas = jest.fn();
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
        CPSAreasGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchCPSAreas
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

    guard = TestBed.inject(CPSAreasGuard);
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

  it('should resolve to true when the cps areas exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadCPSAreasSuccess({ cpsAreas: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching cps areas from the server when not found in the store', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchCPSAreas.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadCPSAreasSuccess({ cpsAreas: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the cps areas', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchCPSAreas.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
