import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { TrialTypesGuard } from '../trial-types.guard';

describe('TrialTypesGuard', () => {
  let guard: TrialTypesGuard;
  let store: Store<ReferenceDataState>;

  let fetchTrialTypes: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchTrialTypes = jest.fn();
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
        TrialTypesGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchTrialTypes
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

    guard = TestBed.inject(TrialTypesGuard);
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

  it('should resolve to true when the trial types exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadTrialTypesSuccess({ trialTypes: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching trial types from the server when not found in the store', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchTrialTypes.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadTrialTypesSuccess({ trialTypes: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the trial types', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchTrialTypes.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
