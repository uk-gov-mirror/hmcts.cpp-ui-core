import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CppHttp } from '@cpp/core';
import { UsersGroupsService } from '../users-groups.service';
import { AddPermissionPayload, RolePermission, UserDetails } from '../../users-groups.interfaces';
import { cold } from 'jasmine-marbles';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

describe('UsersGroupsService', () => {
  let service: UsersGroupsService;
  let http: CppHttp;

  const roles = [
    {
      roleId: 'role-id-1',
      label: 'ATCM case manager',
      description: 'ATCM case manager',
      selectable: false,
      permissionIds: []
    },
    {
      roleId: 'role-id-2',
      label: 'ATCM case manager',
      description: 'ATCM case manager',
      selectable: false,
      permissionIds: []
    }
  ];

  const userGroups = [
    {
      groupId: 'group-id-1',
      groupName: 'Charging Lawyers',
      description: 'Charging Lawyers',
      category: 'speciality',
      organisationId: 'organisation-id',
      roleIds: ['role-id-1', 'role-id-2']
    },
    {
      groupId: 'group-id-2',
      groupName: 'cjse',
      description: 'CJSE Description',
      category: 'speciality',
      organisationId: 'organisation-id',
      roleIds: []
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersGroupsService,
        {
          provide: CppHttp,
          useValue: {
            query: jest.fn(),
            command: jest.fn()
          }
        }
      ]
    });
    http = TestBed.inject(CppHttp);
    service = TestBed.inject(UsersGroupsService);
  });

  describe('fetchLoggedInUserDetails', () => {
    it('should fetch the logged in user details', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ userId: '*' } as UserDetails));

      service.fetchLoggedInUserDetails().subscribe((userDetails) => {
        expect(userDetails).toEqual({ userId: '*' });
        expect(http.query).toHaveBeenCalledWith({
          url: '/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user',
          requestType: 'application/vnd.usersgroups.logged-in-user-details+json'
        });
      });
    });
  });

  describe('fetchUserGroups()', () => {
    it('should fetch the user groups', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ groups: [] }));

      service.fetchUserGroups().subscribe((groups) => {
        expect(groups).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user/groups',
          requestType: 'application/vnd.usersgroups.get-logged-in-user-groups+json'
        });
      });
    });
  });

  describe('fetchUserServices()', () => {
    it('should fetch the user services', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ services: [] }));

      service.fetchUserServices().subscribe((userServices) => {
        expect(userServices).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/usersgroups-query-api/query/api/rest/usersgroups/get-user-services',
          requestType: 'application/vnd.usersgroups.get-user-services+json'
        });
      });
    });
  });

  describe('fetchOrganisations', () => {
    it('should fetch the organisations', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ organisations: [] }));

      service.fetchOrganisations().subscribe((organisations) => {
        expect(organisations).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/usersgroups-query-api/query/api/rest/usersgroups/organisationlist',
          requestType: 'application/vnd.usersgroups.organisations+json'
        });
      });
    });
  });

  describe('fetchGroupsWithOrganisations', () => {
    it('should fetch the groups with organisation', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ groupsWithOrganisation: [] }));

      service.fetchGroupsWithOrganisation().subscribe((groupsWithOrganisation) => {
        expect(groupsWithOrganisation).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/usersgroups-query-api/query/api/rest/usersgroups/groups/organisation',
          requestType: 'application/vnd.usersgroups.get-groups-with-organisation+json'
        });
      });
    });
  });

  describe('fetchUserSelectedGroupsAndRoles', () => {
    it('should fetch roles for a user', () => {
      const response = { groupIds: userGroups.map(({ groupId }) => groupId), allRoles: roles };
      const expected = { groupIds: userGroups.map(({ groupId }) => groupId), allRoles: roles };
      const response$ = cold('-a|', { a: response });
      const expected$ = cold('-b|', { b: expected });

      (http.query as jest.Mock).mockReturnValue(response$);

      const query$ = service.fetchUserSelectedRoles();

      expect(query$).toBeObservable(expected$);
      expect(http.query).toHaveBeenCalledWith({
        url: `/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user/roles`,
        requestType: 'application/vnd.usersgroups.get-roles-for-logged-in-user+json'
      });
    });
  });

  describe('revokeUserPermissions', () => {
    it('should revoke permissions for a user', async () => {
      expect.assertions(4);
      const response$ = of('*').pipe(take(1));
      const permissionIds = ['permission-id-1', 'permission-id-2', 'permission-id-3'];

      (http.command as jest.Mock).mockReturnValue(response$);

      service.revokeUserPermissions(...permissionIds).subscribe((response) => {
        const [{ url, requestType, body }] = (http.command as jest.Mock).mock.calls[0];
        expect(response).toEqual('*');
        expect(url).toEqual('/usersgroups-command-api/command/api/rest/usersgroups/permissions');
        expect(requestType).toEqual('application/vnd.usersgroups.delete-bulk-permission+json');
        expect(body).toEqual({ permissionIds });
      });
    });
  });

  describe('addBulkPermissions', () => {
    it('should add permissions for a user', async () => {
      expect.assertions(4);
      const response$ = of('*').pipe(take(1));
      const permissions: AddPermissionPayload[] = [
        {
          object: 'object',
          action: 'action',
          target: 'target',
          id: '*'
        }
      ] as AddPermissionPayload[];

      (http.command as jest.Mock).mockReturnValue(response$);

      service.addBulkPermissions(permissions).subscribe((response) => {
        const [{ url, requestType, body }] = (http.command as jest.Mock).mock.calls[0];
        expect(response).toEqual('*');
        expect(url).toEqual('/usersgroups-command-api/command/api/rest/usersgroups/permissions');
        expect(requestType).toEqual('application/vnd.usersgroups.add-bulk-permission+json');
        expect(body).toEqual({ permissions });
      });
    });
  });

  describe('getUsersByRole()', () => {
    it('should fetch the user details based on role', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ users: [] }));

      const role = 'Magistrate';

      service.fetchUsersByRole(role).subscribe((users) => {
        expect(users).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: `/usersgroups-query-api/query/api/rest/usersgroups/get-users-by-role?role=${role}`,
          requestType: 'application/vnd.usersgroups.get-users-by-role+json'
        });
      });
    });
  });

  describe('getUsersByPlacementAndRole()', () => {
    it('should fetch the user details based on placement and role', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ users: [] }));

      const placement = 'B01DU00';
      const role = 'Listing Officer';

      service.getUsersByPlacementAndRole(placement, role).subscribe((users) => {
        expect(users).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: `/usersgroups-query-api/query/api/rest/usersgroups/get-users-by-placement-and-role?placement=${placement}&role=${role}`,
          requestType: 'application/vnd.usersgroups.get-users-by-placement-and-role+json'
        });
      });
    });
  });

  describe('getPermissionsBy', () => {
    const permissions = [
      { object: 'object', action: 'action', target: 'target' },
      { object: 'object', action: 'action', target: 'target' }
    ] as RolePermission[];
    it('should get permissions by action and object', async () => {
      expect.assertions(3);
      const response$ = of({ permissions });
      const payload = { object: 'object1', action: 'action1' };

      (http.query as jest.Mock).mockReturnValue(response$);

      service.getPermissionsBy(payload).subscribe((response) => {
        const [{ url, requestType }] = (http.query as jest.Mock).mock.calls[0];
        expect(response).toEqual(permissions);
        expect(url).toEqual(
          `/usersgroups-query-api/query/api/rest/usersgroups/permissions?object=object1&action=action1`
        );
        expect(requestType).toEqual('application/vnd.usersgroups.permissions+json');
      });
    });

    it('should get permissions by action and object and source', async () => {
      expect.assertions(3);
      const response$ = of({ permissions });
      const payload = { object: 'object1', action: 'action1', source: 'source1' };

      (http.query as jest.Mock).mockReturnValue(response$);

      service.getPermissionsBy(payload).subscribe((response) => {
        const [{ url, requestType }] = (http.query as jest.Mock).mock.calls[0];
        expect(response).toEqual(permissions);
        expect(url).toEqual(
          `/usersgroups-query-api/query/api/rest/usersgroups/permissions?object=object1&action=action1&source=source1`
        );
        expect(requestType).toEqual('application/vnd.usersgroups.permissions+json');
      });
    });

    it('should get permissions by action, object, source and target', async () => {
      expect.assertions(3);
      const response$ = of({ permissions });
      const payload = {
        object: 'object1',
        action: 'action1',
        source: 'source1',
        target: 'target1'
      };

      (http.query as jest.Mock).mockReturnValue(response$);

      service.getPermissionsBy(payload).subscribe((response) => {
        const [{ url, requestType }] = (http.query as jest.Mock).mock.calls[0];
        expect(response).toEqual(permissions);
        expect(url).toEqual(
          `/usersgroups-query-api/query/api/rest/usersgroups/permissions?object=object1&action=action1&source=source1&target=target1`
        );
        expect(requestType).toEqual('application/vnd.usersgroups.permissions+json');
      });
    });
  });

  describe('getUserDetails()', () => {
    it('should fetch the user details based on given userId', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of([]));

      const userId = 'user-id';

      service.getUserDetails(userId).subscribe((users) => {
        expect(users).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: `/usersgroups-query-api/query/api/rest/usersgroups/users/${userId}`,
          requestType: 'application/vnd.usersgroups.user-details+json'
        });
      });
    });
  });

  describe('getUsersByRoleAndNamePart()', () => {
    it('should fetch the user details based on role and name part', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ users: [] }));

      const role = 'Legal Advisers';
      const namePart = 'Emma';

      service.fetchUsersByRoleAndNamePart(role, namePart).subscribe((users) => {
        expect(users).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: `/usersgroups-query-api/query/api/rest/usersgroups/get-users-by-role-and-name-part?role=${role}&namePart=${namePart}`,
          requestType: 'application/vnd.usersgroups.get-users-by-role-and-name-part+json'
        });
      });
    });
  });
});
