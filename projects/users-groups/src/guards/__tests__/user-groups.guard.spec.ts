import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { DynatraceService } from '@cpp/core';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UsersGroupsService } from '../../services/users-groups.service';
import { UserGroup } from '../../users-groups.interfaces';
import { UserGroupsGuard } from '../user-groups.guard';

describe('UserGroupsGuard', () => {
  const trackUserGroups = jest.fn();
  let guard: UserGroupsGuard;
  let store: Store<UserGroupsGuard>;
  let fetchUserGroups: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();
    fetchUserGroups = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserGroupsGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchUserGroups
          }
        },
        {
          provide: DynatraceService,
          useValue: {
            trackUserGroups
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

    guard = TestBed.inject(UserGroupsGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const mockUserGroups: UserGroup[] = [
    {
      groupId: 'mock-group-id-1',
      groupName: 'mock-group-name-1',
      description: 'mock-group-description-1'
    },
    {
      groupId: 'mock-group-id-2',
      groupName: 'mock-group-name-2',
      description: 'mock-group-description-£'
    },
    {
      groupId: 'mock-group-id-3',
      groupName: 'mock-group-name-3',
      description: 'mock-group-description-3'
    }
  ];

  const createSnapshot = ({
    userGroupsErrorRedirectTo = '',
    serviceUnavailableRedirectTo = ''
  }: {
    userGroupsErrorRedirectTo?: string;
    serviceUnavailableRedirectTo?: string;
  } = {}) => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      userGroupsErrorRedirectTo,
      serviceUnavailableRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the user groups exist in the store', () => {
    expect.assertions(1);

    const snapshot = createSnapshot();

    store.dispatch(UsersGroupsActions.setUserGroups({ userGroups: mockUserGroups }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching the user groups from the server', () => {
    expect.assertions(3);

    const snapshot = createSnapshot();

    fetchUserGroups.mockReturnValue(of(mockUserGroups));
    const userGroupNames = (mockUserGroups || []).map((group) => group.groupName);

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(trackUserGroups).toHaveBeenCalledWith(userGroupNames);
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        UsersGroupsActions.setUserGroups({ userGroups: mockUserGroups })
      );
    });
  });

  it('should reject the activation when there is an error fetching the user groups', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot({ userGroupsErrorRedirectTo: '/error-page' });

    fetchUserGroups.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      expect(didResolve).toBe(false);
    });
  });

  it('should reject the activation when there is a 404 error fetching the user groups', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 404 });
    const snapshot = createSnapshot({
      serviceUnavailableRedirectTo: '/service-unavailable-error-page'
    });

    fetchUserGroups.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/service-unavailable-error-page');
      expect(didResolve).toBe(false);
    });
  });
});
