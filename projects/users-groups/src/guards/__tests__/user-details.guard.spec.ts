import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { DynatraceService } from '@cpp/core';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UsersGroupsService } from '../../services/users-groups.service';
import { UserDetails } from '../../users-groups.interfaces';
import { UserDetailsGuard } from '../user-details.guard';

describe('UserDetailsGuard', () => {
  const trackUserName = jest.fn();
  let guard: UserDetailsGuard;
  let store: Store<UserDetailsGuard>;
  let fetchLoggedInUserDetails: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();
    fetchLoggedInUserDetails = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserDetailsGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchLoggedInUserDetails
          }
        },
        {
          provide: DynatraceService,
          useValue: {
            trackUserName
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

    guard = TestBed.inject(UserDetailsGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const mockUserDetails: UserDetails = {
    userId: '*',
    firstName: 'James',
    lastName: 'Gray',
    email: 'james@gray.org',
    prosecutingAuthorityAccess: 'TFL'
  };

  const createSnapshot = ({
    userDetailsErrorRedirectTo = '',
    serviceUnavailableRedirectTo = ''
  }: {
    userDetailsErrorRedirectTo?: string;
    serviceUnavailableRedirectTo?: string;
  } = {}) => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      userDetailsErrorRedirectTo,
      serviceUnavailableRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the user details exist in the store', () => {
    expect.assertions(1);

    const snapshot = createSnapshot();

    store.dispatch(UsersGroupsActions.setUserDetails({ userDetails: mockUserDetails }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching the user details from the server', () => {
    expect.assertions(3);

    const snapshot = createSnapshot();

    fetchLoggedInUserDetails.mockReturnValue(of(mockUserDetails));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(trackUserName).toHaveBeenCalledWith(mockUserDetails.email);
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        UsersGroupsActions.setUserDetails({ userDetails: mockUserDetails })
      );
    });
  });

  it('should reject the activation when there is an error fetching the user details', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot({ userDetailsErrorRedirectTo: '/error-page' });

    fetchLoggedInUserDetails.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      expect(didResolve).toBe(false);
    });
  });

  it('should reject the activation when there is a 404 error fetching the user details', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 404 });
    const snapshot = createSnapshot({
      serviceUnavailableRedirectTo: '/service-unavailable-error-page'
    });

    fetchLoggedInUserDetails.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/service-unavailable-error-page');
      expect(didResolve).toBe(false);
    });
  });
});
