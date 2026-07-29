import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import * as UsersGroupsActions from '../../actions/users-groups.actions';
import { usersGroups } from '../../reducers/index';
import { UsersGroupsService } from '../../services/users-groups.service';
import { UserGroupWithOrganisation } from '../../users-groups.interfaces';
import { UserGroupsWithOrganisationGuard } from '@cpp/users-groups';

describe('UserGroupsWithOrganisationGuard', () => {
  let guard: UserGroupsWithOrganisationGuard;
  let store: Store<UserGroupsWithOrganisationGuard>;

  let fetchGroupsWithOrganisation: jest.Mock;
  let navigateByUrl: jest.Mock;

  beforeEach(() => {
    navigateByUrl = jest.fn();
    fetchGroupsWithOrganisation = jest.fn();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} })],
      providers: [
        UserGroupsWithOrganisationGuard,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchGroupsWithOrganisation
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

    guard = TestBed.inject(UserGroupsWithOrganisationGuard);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  const mockGroupWithOrganisations: UserGroupWithOrganisation[] = [
    {
      groupName: 'SJP Prosecutors',
      description: 'Transport for London',
      category: 'speciality',
      organisationId: '6127a06c-c67b-4972-8b47-ba7b22c0eb10',
      roleIds: [],
      resultsReferenceDataGroup: 'Probation',
      documentsReferenceDataGroup: 'Probation Admin',
      groupId: 'd231b119-d748-46da-89fc-293edf114e1'
    }
  ];

  const createSnapshot = (groupWithOrganisationsErrorRedirectTo = '') => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.data = {
      groupWithOrganisationsErrorRedirectTo
    };
    return snapshot;
  };

  it('should resolve to true when the groups with organisation exist in the store', () => {
    expect.assertions(1);

    const snapshot = createSnapshot();

    store.dispatch(
      UsersGroupsActions.setGroupsWithOrganisation({
        groupsWithOrganisation: mockGroupWithOrganisations
      })
    );

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
    });
  });

  it('should resolve to true after fetching the groups with organisation from the server', () => {
    expect.assertions(2);

    const snapshot = createSnapshot();

    fetchGroupsWithOrganisation.mockReturnValue(of(mockGroupWithOrganisations));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(didResolve).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        UsersGroupsActions.setGroupsWithOrganisation({
          groupsWithOrganisation: mockGroupWithOrganisations
        })
      );
    });
  });

  it('should reject the activation when there is an error fetching the groups with organisation', () => {
    expect.assertions(1);

    const error = new HttpErrorResponse({ status: 500 });
    const snapshot = createSnapshot('/error-page');

    fetchGroupsWithOrganisation.mockReturnValue(throwError(error));

    guard.canActivate(snapshot).subscribe((didResolve) => {
      expect(navigateByUrl).toHaveBeenCalledWith('/error-page');
      expect(didResolve).toBe(false);
    });
  });
});
