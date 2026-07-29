import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UserService, UserServiceFeature } from '../../users-groups.interfaces';
import { UserFeatureExistsGuard } from '../user-feature-exist.guard';

describe('UserFeatureExistsGuard', () => {
  let guard: UserFeatureExistsGuard;
  let store: Store<UserFeatureExistsGuard>;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserFeatureExistsGuard,
        {
          provide: Router,
          useValue: {
            navigateByUrl
          }
        }
      ]
    });

    guard = TestBed.inject(UserFeatureExistsGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const snapshot = new ActivatedRouteSnapshot();
  snapshot.data = {
    userFeatureExistsPredicate: (userFeatures: UserServiceFeature[]) =>
      userFeatures.some((userFeature) => userFeature.key === 'someFeature'),
    userServiceExistsErrorRedirectTo: '/error-page'
  };

  it('should resolve to true when the predicate matches the user features', () => {
    expect.assertions(1);

    store.dispatch(
      UsersGroupsActions.setUserFeaturesSuccess({
        userFeatures: [
          {
            key: 'someFeature',
            title: 'someFeature',
            type: 'COMPONENT'
          }
        ]
      })
    );

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should reject the activation when the predicate does not match the user services', () => {
    expect.assertions(2);

    store.dispatch(
      UsersGroupsActions.setUserFeaturesSuccess({
        userFeatures: []
      })
    );

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
    });
  });
});
