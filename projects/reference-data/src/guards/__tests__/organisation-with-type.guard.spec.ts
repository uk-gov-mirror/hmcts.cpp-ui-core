import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { ReferenceDataActions } from '../../actions/index';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { canActivateOrganisationsWithType } from '../organisation-with-type.guard';
import { OrganisationType, OrganisationWithType } from '../../reference-data.interfaces';

const routerSnapshot = {} as RouterStateSnapshot;
const createSnapshot = (referenceDataErrorRedirectTo = '') => {
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.data = {
    referenceDataErrorRedirectTo
  };

  snapshot.queryParams = {
    orgType: OrganisationType.NPS
  };
  return snapshot;
};

describe('OrganisationsWithOrgTypeGuard', () => {
  let store: MockStore<ReferenceDataState>;

  let fetchOrganisationsWithType: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    fetchOrganisationsWithType = jest.fn();
    navigateByUrl = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: {} }),
        {
          provide: ReferenceDataService,
          useValue: {
            fetchOrganisationsWithType
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

    store = TestBed.inject(MockStore);
    store.setState({ referenceData: {} } as ReferenceDataState);
    jest.spyOn(store, 'dispatch');
  });

  it('should resolve to true when the organisations for org type exist in the store', (done) => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    store.setState({
      referenceData: {
        organisationsWithType: [{ orgType: OrganisationType.NPS } as OrganisationWithType]
      }
    });

    const canActivate$ = TestBed.runInInjectionContext(
      () => canActivateOrganisationsWithType(snapshot, routerSnapshot) as Observable<boolean>
    );

    canActivate$.subscribe((didActivate) => {
      expect(didActivate).toBe(true);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ReferenceDataActions.loadOrganisationsWithTypeSuccess({
          organisationsWithType: [{ orgType: OrganisationType.NPS } as OrganisationWithType]
        })
      );
      done();
    });
  });

  it('should resolve to true after fetching organisations with orgType from the server when not found in the store', (done) => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchOrganisationsWithType.mockReturnValue(
      of([{ orgType: OrganisationType.NPS } as OrganisationWithType])
    );

    const canActivate$ = TestBed.runInInjectionContext(
      () => canActivateOrganisationsWithType(snapshot, routerSnapshot) as Observable<boolean>
    );

    canActivate$.subscribe((didActivate) => {
      expect(didActivate).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        ReferenceDataActions.loadOrganisationsWithTypeSuccess({
          organisationsWithType: [{ orgType: OrganisationType.NPS } as OrganisationWithType]
        })
      );
      done();
    });
  });

  it('should reject the activation when there is an error fetching the organisations with org type', (done) => {
    expect.assertions(2);
    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchOrganisationsWithType.mockReturnValue(throwError(error));

    const canActivate$ = TestBed.runInInjectionContext(
      () => canActivateOrganisationsWithType(snapshot, routerSnapshot) as Observable<boolean>
    );

    canActivate$.subscribe((didActivate) => {
      expect(didActivate).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      done();
    });
  });
});
