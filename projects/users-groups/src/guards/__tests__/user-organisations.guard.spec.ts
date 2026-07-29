import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UsersGroupsService } from '../../services/users-groups.service';
import { UserOrganisation } from '../../users-groups.interfaces';
import { UserOrganisationsGuard } from '@cpp/users-groups';

describe('UserOrganisationsGuard', () => {
  let guard: UserOrganisationsGuard;
  let store: Store<UserOrganisationsGuard>;

  let fetchOrganisations: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();
    fetchOrganisations = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserOrganisationsGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchOrganisations
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

    guard = TestBed.inject(UserOrganisationsGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const mockOrganisations: UserOrganisation[] = [
    {
      organisationId: 'test-organisation-id',
      organisationName: 'test-organisation-name',
      organisationType: 'test-organisation-type'
    }
  ];

  const createSnapshot = (userOrganisationsErrorRedirectTo = '') => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      userOrganisationsErrorRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the organisations exist in the store', () => {
    expect.assertions(1);

    const snapshot = createSnapshot();

    store.dispatch(UsersGroupsActions.setUserOrganisations({ organisations: mockOrganisations }));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching the organisations from the server', () => {
    expect.assertions(2);

    const snapshot = createSnapshot();

    fetchOrganisations.mockReturnValue(of(mockOrganisations));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        UsersGroupsActions.setUserOrganisations({ organisations: mockOrganisations })
      );
    });
  });

  it('should reject the activation when there is an error fetching the organisations', () => {
    expect.assertions(2);

    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchOrganisations.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      expect(didResolve).toBe(false);
    });
  });
});
