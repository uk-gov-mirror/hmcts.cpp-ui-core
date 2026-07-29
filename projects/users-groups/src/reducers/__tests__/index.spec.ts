import * as UsersGroupsActions from '../../actions/users-groups.actions';
import {
  UserGroupType,
  UserGroup,
  UserServiceFeature,
  UserRole
} from '../../users-groups.interfaces';
import * as fromUsersGroups from '../index';

describe('usersGroupsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = fromUsersGroups.usersGroups(undefined, {} as any);

      expect(result).toMatchSnapshot();
    });
  });

  describe('UsersGroupsActions.setUserDetails', () => {
    it('should set the user details', () => {
      const action = UsersGroupsActions.setUserDetails({
        userDetails: {
          userId: '*',
          firstName: 'James',
          lastName: 'Gray',
          email: 'james@gray.org',
          prosecutingAuthorityAccess: 'TFL'
        }
      });
      const result = fromUsersGroups.usersGroups(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('UsersGroupsActions.setUserDetails', () => {
    it('should set the user roles', () => {
      const action = UsersGroupsActions.setUserRoles({
        userRoles: [{ roleId: 'test-user-role-id' }] as UserRole[]
      });
      const result = fromUsersGroups.usersGroups(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('UsersGroupsActions.setUserServices', () => {
    it('should set user services', () => {
      const action = UsersGroupsActions.setUserServices({
        userServices: [
          {
            name: '*',
            features: [],
            containsSearch: true
          }
        ]
      });
      const result = fromUsersGroups.usersGroups(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('UsersGroupsActions.setUserPermissions', () => {
    it('should set user permissions', () => {
      const action = UsersGroupsActions.setUserPermissions({
        userGroups: [],
        permissions: [
          {
            action: 'test',
            object: 'permission',
            description: '*',
            permissionId: 'permission-id-1',
            target: 'target-01'
          },
          {
            action: 'test',
            object: 'permission',
            description: '*',
            permissionId: 'permission-id-2',
            target: 'target-02'
          },
          {
            action: 'test',
            object: 'permission',
            description: '*',
            permissionId: 'permission-id-3'
          }
        ]
      });
      const result = fromUsersGroups.usersGroups(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('UsersGroupsActions.setUserOrganisations', () => {
    it('should set the organisations', () => {
      const action = UsersGroupsActions.setUserOrganisations({
        organisations: [
          {
            organisationId: 'test-organisation-id',
            organisationName: 'test-organisation-name',
            organisationType: 'test-organisation-type'
          }
        ]
      });
      const result = fromUsersGroups.usersGroups(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('UsersGroupsActions.setGroupsWithOrganisation', () => {
    it('should set the groups with organisation', () => {
      const action = UsersGroupsActions.setGroupsWithOrganisation({
        groupsWithOrganisation: [
          {
            groupName: 'SJP Prosecutors',
            description: 'Transport for London',
            category: 'speciality',
            organisationId: '6127a06c-c67b-4972-8b47-ba7b22c0eb10',
            resultsReferenceDataGroup: 'Probation',
            documentsReferenceDataGroup: 'Probation Admin',
            groupId: 'd231b119-d748-46da-89fc-293edf114e1',
            roleIds: []
          }
        ]
      });
      const result = fromUsersGroups.usersGroups(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('selectors', () => {
    describe('getUserDetails', () => {
      it('should select the user details', () => {
        expect(
          fromUsersGroups.getUserDetails({
            usersGroups: {
              userDetails: {
                userId: '*',
                firstName: 'James',
                lastName: 'Gray',
                email: 'james@gray.org',
                prosecutingAuthorityAccess: 'TFL'
              }
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toMatchSnapshot();
      });
    });

    describe('getUserRoles', () => {
      it('should select the user roles', () => {
        expect(
          fromUsersGroups.getUserRoles({
            usersGroups: {
              userRoles: [
                {
                  roleId: 'test-user-role-id',
                  description: 'test-user-role-description'
                }
              ] as UserRole[]
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toMatchSnapshot();
      });
    });

    describe('getAllUserPlacements', () => {
      it('should select the all the placements of all the roles', () => {
        expect(
          fromUsersGroups.getAllUserPlacements({
            usersGroups: {
              userRoles: [
                {
                  roleId: 'test-user-role-id-1',
                  description: 'test-user-role-description-1',
                  userPlacements: [
                    {
                      placementId: 'test-role-1-placement-id-1'
                    },
                    {
                      placementId: 'test-role-1-placement-id-2'
                    }
                  ]
                },
                {
                  roleId: 'test-user-role-id-2',
                  description: 'test-user-role-description-2',
                  userPlacements: [
                    {
                      placementId: 'test-role-2-placement-id-1'
                    },
                    {
                      placementId: 'test-role-2-placement-id-2'
                    }
                  ]
                }
              ] as UserRole[]
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toMatchSnapshot();
      });
    });

    describe('getUserOrganisations', () => {
      it('should select the organisations', () => {
        expect(
          fromUsersGroups.getUserOrganisations({
            usersGroups: {
              organisations: [
                {
                  organisationId: 'test-organisation-id',
                  organisationName: 'test-organisation-name',
                  organisationType: 'test-organisation-type'
                }
              ]
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toMatchSnapshot();
      });
    });

    describe('getGroupsWithOrganisation', () => {
      it('should select the groups with organisation', () => {
        expect(
          fromUsersGroups.getGroupsWithOrganisation({
            usersGroups: {
              groupsWithOrganisation: [
                {
                  groupName: 'SJP Prosecutors',
                  description: 'Transport for London',
                  category: 'speciality',
                  organisationId: '6127a06c-c67b-4972-8b47-ba7b22c0eb10',
                  resultsReferenceDataGroup: 'Probation',
                  documentsReferenceDataGroup: 'Probation Admin',
                  groupId: 'd231b119-d748-46da-89fc-293edf114e1',
                  roleIds: ['test-role-id']
                }
              ]
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toMatchSnapshot();
      });
    });

    describe('getUserServices', () => {
      it('should select the user services', () => {
        expect(
          fromUsersGroups.getUserServices({
            usersGroups: {
              userServices: [
                {
                  name: '*',
                  features: [] as UserServiceFeature[],
                  containsSearch: true
                }
              ]
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toMatchSnapshot();
      });
    });

    describe('getUserCanSearch', () => {
      it('should select whether the user has search privileges', () => {
        expect(
          fromUsersGroups.getUserCanSearch({
            usersGroups: {
              userGroups: [] as UserGroup[]
            }
          } as fromUsersGroups.UsersGroupsState)
        ).toEqual(false);

        (
          [
            { groupName: 'Court Administrators', canSearch: true },
            { groupName: 'Crown Court Admin', canSearch: true },
            { groupName: 'Court Clerks', canSearch: true },
            { groupName: 'Legal Advisers', canSearch: true },
            { groupName: 'Listing Officers', canSearch: true },
            { groupName: 'Judge', canSearch: true },
            { groupName: 'CPS', canSearch: true },
            { groupName: 'Court Associate', canSearch: true },
            { groupName: 'Youth Offending Service Admin', canSearch: true },
            { groupName: 'TFL User', canSearch: false }
          ] as { groupName: UserGroupType; canSearch: boolean }[]
        ).forEach(({ groupName, canSearch }) => {
          const valid = fromUsersGroups.getUserCanSearch({
            usersGroups: {
              userGroups: [{ groupName, groupId: '*', description: '*' }]
            }
          } as fromUsersGroups.UsersGroupsState);
          if (valid !== canSearch) {
            throw new Error(
              `Expected \`getUserCanSearch\` for ${groupName} to be ${canSearch}. Got ${valid}.`
            );
          }
        });
      });
    });

    describe('Permissions', () => {
      const permissions = [
        {
          action: 'test',
          object: 'permission',
          description: '*'
        }
      ];
      const permissionsMap = {
        'permission-id': {
          action: 'test',
          object: 'permission',
          description: '*',
          permissionId: 'permission-id'
        }
      };

      describe('getUserRolePermissionsMap', () => {
        it('should return  permissions map from permissions', () => {
          expect(
            fromUsersGroups.getUserRolePermissionsMap({
              usersGroups: {
                permissionsMap
              }
            } as fromUsersGroups.UsersGroupsState)
          ).toMatchSnapshot();
        });
      });

      describe('getUserRolePermissions', () => {
        it('should return aggregated permissions for user', () => {
          expect(
            fromUsersGroups.getUserRolePermissions({
              usersGroups: {
                permissionsMap
              }
            } as fromUsersGroups.UsersGroupsState)
          ).toMatchSnapshot();
        });
      });

      describe('getAllUserRolePermissionIds', () => {
        it('should return permission ids for user', () => {
          expect(
            fromUsersGroups.getAllUserRolePermissionIds({
              usersGroups: {
                permissionsMap
              }
            } as fromUsersGroups.UsersGroupsState)
          ).toMatchSnapshot();
        });
      });
    });
  });
});
