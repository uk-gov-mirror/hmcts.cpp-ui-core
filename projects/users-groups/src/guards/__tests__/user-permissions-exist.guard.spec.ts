import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { UsersGroupsState, usersGroups } from '../../reducers/index';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { setUserPermissions } from '../../actions/users-groups.actions';
import { RolePermission } from '../../users-groups.interfaces';
import { UserPermissionsExistGuard } from '../permissions/user-permissions-exist.guard';

describe('UserPermissionsExistGuard', () => {
  const navigateByUrl = jest.fn();
  let store: Store<UsersGroupsState>;
  let router: Router;
  let guardService: UserPermissionsExistGuard;
  let snapShot: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserPermissionsExistGuard,
        {
          provide: Router,
          useValue: { navigateByUrl }
        }
      ]
    });

    store = TestBed.inject(Store);
    guardService = TestBed.inject(UserPermissionsExistGuard);
    router = TestBed.inject(Router);
    jest.spyOn(store, 'dispatch');
  });

  it('should activate route when the predicate condition is truthy', () => {
    const expectedPermission = { action: 'view', object: 'case' } as RolePermission;

    setUpPermissionTestData(expectedPermission);

    store.dispatch(setUserPermissions({ permissions: [expectedPermission] }));

    expect.assertions(1);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBeTruthy();
    });
  });

  it('should not activate route when the predicate condition is falsy', () => {
    const expectedPermission = { action: 'view', object: 'case' } as RolePermission;
    const existingPermission = { action: 'view', object: 'hearing' } as RolePermission;
    setUpPermissionTestData(expectedPermission);

    store.dispatch(setUserPermissions({ permissions: [existingPermission] }));

    expect.assertions(2);

    guardService.canActivate(snapShot).subscribe((canActivate) => {
      expect(canActivate).toBeFalsy();
      expect(navigateByUrl).toHaveBeenCalledWith('/unauthorised');
    });
  });

  const setUpPermissionTestData = ({ action, object, source, target }: RolePermission) => {
    snapShot = new ActivatedRouteSnapshot();
    snapShot.data = {
      userPermissionsExistsErrorRedirectTo: '/unauthorised',
      userPermissionsExistsPredicate: (userPermissions: RolePermission[]) =>
        userPermissions.some(
          (perm) =>
            perm.action === action &&
            perm.object === object &&
            perm.source === source &&
            perm.target === target
        )
    };
    return snapShot;
  };
});
