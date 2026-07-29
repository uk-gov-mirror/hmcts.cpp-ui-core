import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { RotaBusinessTypesGuard } from '../rota-business-types.guard';

describe('RotaBusinessTypesGuard', () => {
  let guard: RotaBusinessTypesGuard;
  let store: Store<ReferenceDataState>;

  let fetchRotaBusinessTypes: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchRotaBusinessTypes = jest.fn();
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
        RotaBusinessTypesGuard,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchRotaBusinessTypes
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

    guard = TestBed.inject(RotaBusinessTypesGuard);
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

  it('should resolve to true when the rota business types exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();

    store.dispatch(ReferenceDataActions.loadRotaBusinessTypesSuccess({ rotaBusinessTypes: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching rota business types from the server when not found in the store', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchRotaBusinessTypes.mockReturnValue(of([]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadRotaBusinessTypesSuccess({ rotaBusinessTypes: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the rota business types', () => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchRotaBusinessTypes.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
