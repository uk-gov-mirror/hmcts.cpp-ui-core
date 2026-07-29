import { TestBed } from '@angular/core/testing';
import { UsersGroupsService } from '../../services/users-groups.service';
import { Store, StoreModule } from '@ngrx/store';
import { UsersGroupsState, usersGroups } from '../../reducers/index';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { setUserPermissions } from '../../actions/users-groups.actions';
import { RolePermission } from '../../users-groups.interfaces';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPermissionsGuard } from '../permissions/user-permissions.guard';

describe('UserPermissionsGuard', () => {
  const fetchUserPermissions = jest.fn();
  const navigateByUrl = jest.fn();
  const getCurrentNavigation = jest.fn().mockReturnValue({
    extras: {}
  });
  let store: Store<UsersGroupsState>;
  let userGroupService: UsersGroupsService;
  let router: Router;
  let guardService: UserPermissionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserPermissionsGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchUserPermissions
          }
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
            getCurrentNavigation
          }
        }
      ]
    });

    store = TestBed.inject(Store);
    guardService = TestBed.inject(UserPermissionsGuard);
    router = TestBed.inject(Router);
    userGroupService = TestBed.inject(UsersGroupsService);
    jest.spyOn(store, 'dispatch');
  });

  it('should activate route when user permissions exist in store', () => {
    const { snapShot, permissions } = setUpPermissionTestData([
      { action: 'view', object: 'case' }
    ] as RolePermission[]);

    store.dispatch(setUserPermissions({ permissions }));

    expect.assertions(1);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBe(true);
    });
  });

  it('should call api to retrieve user permissions if not in store', () => {
    const { snapShot, permissions } = setUpPermissionTestData([]);

    store.dispatch(setUserPermissions({ permissions }));

    expect.assertions(1);

    guardService.canActivate(snapShot).subscribe((_) => {
      expect(fetchUserPermissions).toHaveBeenCalled();
    });
  });

  it('should call api to retrieve user permissions if route state has ignoreUserPermissionsFromStore set to true', () => {
    const { snapShot, permissions } = setUpPermissionTestData([
      { action: 'view', object: 'case', target: '' }
    ] as RolePermission[]);

    fetchUserPermissions.mockReturnValue(of({ permissions }));

    getCurrentNavigation.mockReturnValueOnce({
      extras: {
        state: {
          ignoreUserPermissionsFromStore: true
        }
      }
    });

    store.dispatch(setUserPermissions({ permissions }));

    expect.assertions(1);

    guardService.canActivate(snapShot).subscribe((_) => {
      expect(fetchUserPermissions).toHaveBeenCalled();
    });
  });

  it('should redirect to unauthorised page if user has no permissions & route state has ignoreUserPermissionsFromStore set to true', () => {
    const { snapShot, permissions } = setUpPermissionTestData(undefined, {
      userNoPermissionsRedirectTo: '/unauthorised-page'
    });

    fetchUserPermissions.mockReturnValue(of({ permissions }));

    getCurrentNavigation.mockReturnValueOnce({
      extras: {
        state: {
          ignoreUserPermissionsFromStore: true
        }
      }
    });

    expect.assertions(2);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/unauthorised-page');
    });
  });

  it('should redirect to error page if error occurs while retrieving user permissions & route state has ignoreUserPermissionsFromStore set to true', () => {
    const { snapShot } = setUpPermissionTestData([], {
      userPermissionsErrorRedirectTo: '/technical-error-page'
    });

    fetchUserPermissions.mockReturnValue(throwError(new HttpErrorResponse({ status: 400 })));

    getCurrentNavigation.mockReturnValueOnce({
      extras: {
        state: {
          ignoreUserPermissionsFromStore: true
        }
      }
    });

    expect.assertions(2);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/technical-error-page');
    });
  });

  it('should activate route when user permissions are to be retrieved from API end point', () => {
    const { snapShot, permissions } = setUpPermissionTestData([
      { action: 'view', object: 'case', target: '' }
    ] as RolePermission[]);

    fetchUserPermissions.mockReturnValue(of({ permissions }));

    expect.assertions(3);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(setUserPermissions({ permissions }));
      expect(canActivate).toBe(true);
    });
  });

  it('should redirect to unauthorised page if user has no permissions', () => {
    const { snapShot, permissions } = setUpPermissionTestData(undefined, {
      userNoPermissionsRedirectTo: '/unauthorised-page'
    });

    fetchUserPermissions.mockReturnValue(of({ permissions }));

    expect.assertions(2);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/unauthorised-page');
    });
  });

  it('should redirect to error page if error except 404 occurs while retrieving user permissions', () => {
    const { snapShot } = setUpPermissionTestData([], {
      userPermissionsErrorRedirectTo: '/technical-error-page'
    });

    fetchUserPermissions.mockReturnValue(throwError(new HttpErrorResponse({ status: 400 })));

    expect.assertions(2);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/technical-error-page');
    });
  });

  it('should redirect to service unavailable page if 404 error occurs while retrieving user permissions', () => {
    const { snapShot } = setUpPermissionTestData([], {
      serviceUnavailableRedirectTo: '/service-unavailable-page'
    });

    fetchUserPermissions.mockReturnValue(throwError(new HttpErrorResponse({ status: 404 })));

    expect.assertions(2);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/service-unavailable-page');
    });
  });

  const setUpPermissionTestData = (
    permissions: RolePermission[] | undefined,
    redirectRoutes: {
      userPermissionsErrorRedirectTo?: string;
      userNoPermissionsRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    } = {}
  ) => {
    const snapShot = new ActivatedRouteSnapshot();
    snapShot.data = { ...redirectRoutes };
    return { snapShot, permissions };
  };
});
