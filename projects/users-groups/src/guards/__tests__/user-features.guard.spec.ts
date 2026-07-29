import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UsersGroupsService } from '../../services/users-groups.service';
import { UserFeaturesGuard } from '../user-features.guard';
import { of, throwError } from 'rxjs';
import { UserServiceFeature } from '../../users-groups.interfaces';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserFeaturesGuard', () => {
  let guard: UserFeaturesGuard;
  let store: Store<UserFeaturesGuard>;

  let fetchUserFeatures: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();
    fetchUserFeatures = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserFeaturesGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchUserFeatures
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

    guard = TestBed.inject(UserFeaturesGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const createSnapshot = ({
    userFeaturesErrorRedirectTo = '',
    serviceUnavailableRedirectTo = ''
  }: {
    userFeaturesErrorRedirectTo?: string;
    serviceUnavailableRedirectTo?: string;
  } = {}) => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      userFeaturesErrorRedirectTo,
      serviceUnavailableRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the user services exist in the store', () => {
    expect.assertions(1);
    const snapshot = createSnapshot();
    store.dispatch(
      UsersGroupsActions.setUserFeaturesSuccess({
        userFeatures: [{ key: 'somefeature', title: 'sometitle', type: 'COMPONENT' }]
      })
    );

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('Should dispatch an action and resolve true when user features returns an empty array', () => {
    expect.assertions(2);
    const snapshot = createSnapshot();

    fetchUserFeatures.mockReturnValue(of([] as UserServiceFeature[]));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        UsersGroupsActions.setUserFeaturesSuccess({ userFeatures: [] })
      );
    });
  });

  it('should reject the activation when there is an error fetching the user features', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot({ userFeaturesErrorRedirectTo: '/error-page' });

    fetchUserFeatures.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      expect(didResolve).toBe(false);
    });
  });

  it('should reject the activation when there is a 404 error fetching the user features', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 404 });
    const snapshot = createSnapshot({
      serviceUnavailableRedirectTo: '/service-unavailable-error-page'
    });

    fetchUserFeatures.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/service-unavailable-error-page');
      expect(didResolve).toBe(false);
    });
  });
});
