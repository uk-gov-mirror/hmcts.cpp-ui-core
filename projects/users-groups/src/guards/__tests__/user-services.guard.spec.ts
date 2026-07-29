import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UsersGroupsService } from '../../services/users-groups.service';
import { UserServicesGuard } from '../user-services.guard';
import { UserService } from '../../users-groups.interfaces';

describe('UserServicesGuard', () => {
  let guard: UserServicesGuard;
  let store: Store<UserServicesGuard>;

  let fetchUserServices: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();
    fetchUserServices = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserServicesGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchUserServices
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

    guard = TestBed.inject(UserServicesGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const createSnapshot = ({
    userServicesErrorRedirectTo = '',
    serviceUnavailableRedirectTo = ''
  }: {
    userServicesErrorRedirectTo?: string;
    serviceUnavailableRedirectTo?: string;
  } = {}) => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      userServicesErrorRedirectTo,
      serviceUnavailableRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the user services exist in the store', () => {
    expect.assertions(1);

    const snapshot = createSnapshot();

    store.dispatch(UsersGroupsActions.setUserServices({ userServices: [] }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching user services from the server when not found in the store', () => {
    expect.assertions(2);

    const snapshot = createSnapshot();

    fetchUserServices.mockReturnValue(of([] as UserService[]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        UsersGroupsActions.setUserServices({ userServices: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the user services', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot({ userServicesErrorRedirectTo: '/error-page' });

    fetchUserServices.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      expect(didResolve).toBe(false);
    });
  });

  it('should reject the activation when there is a 404 error fetching the user services', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 404 });
    const snapshot = createSnapshot({
      serviceUnavailableRedirectTo: '/service-unavailable-error-page'
    });

    fetchUserServices.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/service-unavailable-error-page');
      expect(didResolve).toBe(false);
    });
  });
});
