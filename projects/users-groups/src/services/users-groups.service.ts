import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CppHttp } from '@cpp/core';

import {
  UserDetails,
  UserGroup,
  UserService,
  UserPermissions,
  UserOrganisation,
  UserGroupWithOrganisation,
  UserRole,
  UserServiceFeature,
  RolePermission,
  AddPermissionPayload,
  UserPersonalDetails
} from '../users-groups.interfaces';
import { isEmpty } from 'lodash-es';
@Injectable()
export class UsersGroupsService {
  constructor(private http: CppHttp) {}

  fetchLoggedInUserDetails(): Observable<UserDetails> {
    return this.http.query<UserDetails>({
      url: '/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user',
      requestType: 'application/vnd.usersgroups.logged-in-user-details+json'
    });
  }

  /**@deprecated use the fetchUserPermissions method instead to retrieve groups.*/
  fetchUserGroups(): Observable<UserGroup[]> {
    return this.http
      .query<{ groups: UserGroup[] }>({
        url: '/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user/groups',
        requestType: 'application/vnd.usersgroups.get-logged-in-user-groups+json'
      })
      .pipe(map((result) => result.groups));
  }

  fetchUserPermissions(): Observable<UserPermissions> {
    return this.http.query<UserPermissions>({
      url: '/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user/permissions',
      requestType: 'application/vnd.usersgroups.get-logged-in-user-permissions+json'
    });
  }

  fetchUserServices(): Observable<UserService[]> {
    return this.http
      .query<{ services: UserService[] }>({
        url: '/usersgroups-query-api/query/api/rest/usersgroups/get-user-services',
        requestType: 'application/vnd.usersgroups.get-user-services+json'
      })
      .pipe(map((result) => result.services));
  }

  fetchUserFeatures(): Observable<UserServiceFeature[]> {
    return this.http
      .query<{ features: UserServiceFeature[] }>({
        url: '/usersgroups-query-api/query/api/rest/usersgroups/features/enabled',
        requestType: 'application/vnd.usersgroups.features+json'
      })
      .pipe(map((result) => result.features));
  }

  fetchOrganisations(): Observable<UserOrganisation[]> {
    return this.http
      .query<{ organisations: UserOrganisation[] }>({
        url: '/usersgroups-query-api/query/api/rest/usersgroups/organisationlist',
        requestType: 'application/vnd.usersgroups.organisations+json'
      })
      .pipe(map((result) => result.organisations));
  }

  fetchGroupsWithOrganisation(): Observable<UserGroupWithOrganisation[]> {
    return this.http
      .query<{ groupsWithOrganisation: UserGroupWithOrganisation[] }>({
        url: '/usersgroups-query-api/query/api/rest/usersgroups/groups/organisation',
        requestType: 'application/vnd.usersgroups.get-groups-with-organisation+json'
      })
      .pipe(map((result) => result.groupsWithOrganisation));
  }

  fetchUserSelectedRoles(): Observable<{ groupIds: string[]; allRoles: UserRole[] }> {
    return this.http.query<{ groupIds: string[]; allRoles: UserRole[] }>({
      url: `/usersgroups-query-api/query/api/rest/usersgroups/users/logged-in-user/roles`,
      requestType: 'application/vnd.usersgroups.get-roles-for-logged-in-user+json'
    });
  }

  revokeUserPermissions(...permissionIds: string[]): Observable<unknown> {
    return this.http.command({
      url: '/usersgroups-command-api/command/api/rest/usersgroups/permissions',
      requestType: 'application/vnd.usersgroups.delete-bulk-permission+json',
      body: {
        permissionIds
      }
    });
  }

  addBulkPermissions(permissions: AddPermissionPayload[]): Observable<unknown> {
    return this.http.command({
      url: '/usersgroups-command-api/command/api/rest/usersgroups/permissions',
      requestType: 'application/vnd.usersgroups.add-bulk-permission+json',
      body: {
        permissions
      }
    });
  }

  getPermissionsBy({
    action,
    object,
    source,
    target
  }: {
    object: string;
    action: string;
    source?: string;
    target?: string;
  }): Observable<RolePermission[]> {
    let url = `/usersgroups-query-api/query/api/rest/usersgroups/permissions?object=${object}&action=${action}`;

    if (!!source) {
      url = url.concat(`&source=${source}`);
    }

    if (!!target) {
      url = url.concat(`&target=${target}`);
    }

    return this.http
      .query<{ permissions: RolePermission[] }>({
        url,
        requestType: 'application/vnd.usersgroups.permissions+json'
      })
      .pipe(map((result) => result.permissions));
  }

  fetchUsersByRole(role: string): Observable<UserPersonalDetails[]> {
    return this.http
      .query<{ users: UserPersonalDetails[] }>({
        url: `/usersgroups-query-api/query/api/rest/usersgroups/get-users-by-role?role=${role}`,
        requestType: 'application/vnd.usersgroups.get-users-by-role+json'
      })
      .pipe(map((res) => res.users));
  }

  getUsersByPlacementAndRole(placement: string, role: string): Observable<UserDetails[]> {
    return this.http
      .query<{ users: UserDetails[] }>({
        url: `/usersgroups-query-api/query/api/rest/usersgroups/get-users-by-placement-and-role?placement=${placement}&role=${role}`,
        requestType: 'application/vnd.usersgroups.get-users-by-placement-and-role+json'
      })
      .pipe(map((users) => users.users));
  }

  getUserDetails(userId: string): Observable<UserDetails> {
    return this.http.query<UserDetails>({
      url: `/usersgroups-query-api/query/api/rest/usersgroups/users/${userId}`,
      requestType: 'application/vnd.usersgroups.user-details+json'
    });
  }

  fetchUsersByRoleAndNamePart(role: string, namePart: string): Observable<UserPersonalDetails[]> {
    return this.http
      .query<{ users: UserPersonalDetails[] }>({
        url: `/usersgroups-query-api/query/api/rest/usersgroups/get-users-by-role-and-name-part?role=${role}&namePart=${namePart}`,
        requestType: 'application/vnd.usersgroups.get-users-by-role-and-name-part+json'
      })
      .pipe(map((res) => res.users));
  }
}
