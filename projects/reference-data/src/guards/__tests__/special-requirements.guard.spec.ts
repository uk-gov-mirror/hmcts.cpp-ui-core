import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { SpecialRequirementsGuard } from '../special-requirement.guard';

describe('SpecialRequirementsGuard', () => {
  let guard: SpecialRequirementsGuard;
  let store: Store<ReferenceDataState>;

  let fetchSpecialRequirements: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchSpecialRequirements = jest.fn();
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
        SpecialRequirementsGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchSpecialRequirements
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

    guard = TestBed.inject(SpecialRequirementsGuard);
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

  it('should resolve to true when the special requirements exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(
      ReferenceDataActions.loadSpecialRequirementsSuccess({ specialRequirements: [] })
    );

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching special requirements from the server when not found in the store', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchSpecialRequirements.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadSpecialRequirementsSuccess({ specialRequirements: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the special requirements', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchSpecialRequirements.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
