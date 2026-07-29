import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { PoliceRanksGuard } from '../police-ranks.guard';

describe('PoliceRanksGuard', () => {
  let guard: PoliceRanksGuard;
  let store: Store<ReferenceDataState>;

  let fetchPoliceRanks: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchPoliceRanks = jest.fn();
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
        PoliceRanksGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchPoliceRanks
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

    guard = TestBed.get(PoliceRanksGuard);
    store = TestBed.get(Store);

    jest.spyOn(store, 'dispatch');
  });

  const createSnapshot = (referenceDataErrorRedirectTo = '') => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      referenceDataErrorRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the policeRanks exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadPoliceRanksSuccess({ policeRanks: [] }));

    guard.canActivate(snapshot).subscribe(didResolve => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching policeRanks from the server when not found in the store', () => {
    const snapshot = createSnapshot();

    fetchPoliceRanks.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe(didResolve => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadPoliceRanksSuccess({ policeRanks: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the policeRanks', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchPoliceRanks.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe(didResolve => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
