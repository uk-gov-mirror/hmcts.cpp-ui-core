import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UserService } from '../../users-groups.interfaces';
import { UserServiceExistsGuard } from '../user-service-exists.guard';

describe('UserServiceExistsGuard', () => {
  let guard: UserServiceExistsGuard;
  let store: Store<UserServiceExistsGuard>;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserServiceExistsGuard,
        {
          provide: Router,
          useValue: {
            navigateByUrl
          }
        }
      ]
    });

    guard = TestBed.inject(UserServiceExistsGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const snapshot = new ActivatedRouteSnapshot();
  snapshot.data = {
    userServiceExistsPredicate: (userServices: UserService[]) =>
      userServices.some((userService) => userService.containsSearch),
    userServiceExistsErrorRedirectTo: '/error-page'
  };

  it('should resolve to true when the predicate matches the user services', () => {
    expect.assertions(1);

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });

    store.dispatch(
      UsersGroupsActions.setUserServices({
        userServices: [
          {
            name: '*',
            containsSearch: true,
            features: []
          }
        ]
      })
    );
  });

  it('should reject the activation when the predicate does not match the user services', () => {
    expect.assertions(2);

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });

    store.dispatch(
      UsersGroupsActions.setUserServices({
        userServices: [
          {
            name: '*',
            containsSearch: false,
            features: []
          }
        ]
      })
    );
  });
});
