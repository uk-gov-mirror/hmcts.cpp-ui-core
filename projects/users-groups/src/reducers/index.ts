import { Action, MemoizedSelector, createSelector, defaultMemoize } from '@ngrx/store';
import { State, userGroupsReducer } from './users-groups.reducer';
import {
  aggregateRolePermissions,
  PermissionOperator,
  permissionsExist,
  RequiredPermission
} from '../utils';
import { UserServiceFeature } from '../users-groups.interfaces';

export interface UsersGroupsState {
  usersGroups: State;
}

/** Provide reducer in AoT-compilation happy way */
export function usersGroups(state: State | undefined, action: Action) {
  return userGroupsReducer(state, action);
}

export const getUserDetails = (state: UsersGroupsState) => state.usersGroups.userDetails;
export const getUserGroups = (state: UsersGroupsState) => state.usersGroups.userGroups;
export const getUserRoles = (state: UsersGroupsState) => state.usersGroups.userRoles;
export const getUserServices = (state: UsersGroupsState) => state.usersGroups.userServices;
export const getUserOrganisations = (state: UsersGroupsState) => state.usersGroups.organisations;
export const getUserFeatures = (state: UsersGroupsState) => state.usersGroups.features;

export const getGroupsWithOrganisation = (state: UsersGroupsState) =>
  state.usersGroups.groupsWithOrganisation;
export const getUserSwitchableRoles = (state: UsersGroupsState) =>
  state.usersGroups.switchableRoles;

export const getUserRolePermissionsMap = (state: UsersGroupsState) =>
  state.usersGroups.permissionsMap;

export const getUserRolePermissions = createSelector(getUserRolePermissionsMap, (permissionsMap) =>
  aggregateRolePermissions(Object.values(permissionsMap))
);

export const getAllUserRolePermissionIds = createSelector(
  getUserRolePermissionsMap,
  (permissionsMap) => Object.keys(permissionsMap)
);

export const getUserHasPermission = (
  requiredPermissions: RequiredPermission[],
  operation = PermissionOperator.and,
  target?: string,
  source?: string
) =>
  createSelector(getUserRolePermissions, (userPermissions) =>
    permissionsExist(userPermissions, requiredPermissions, operation, target, source)
  );

export const getUserCanSearch = createSelector(getUserGroups, (userGroups) =>
  (userGroups || []).some((userGroup) =>
    [
      'Court Administrators',
      'Crown Court Admin',
      'Court Clerks',
      'Legal Advisers',
      'Listing Officers',
      'Judge',
      'CPS',
      'Court Associate',
      'Youth Offending Service Admin'
    ].includes(userGroup.groupName)
  )
);

export const getAllUserPlacements = createSelector(getUserRoles, (userRoles) => {
  const placements = (userRoles || []).map((userRole) => userRole.userPlacements || []);
  return placements.reduce(
    (flattenedPlacements, nextPlacements) => flattenedPlacements.concat(nextPlacements),
    []
  );
});

export const getFeaturesByFeatureType = (
  type: string
): MemoizedSelector<UsersGroupsState, UserServiceFeature[]> =>
  defaultMemoize((type: string) =>
    createSelector(getUserFeatures, (features: UserServiceFeature[] | undefined) =>
      (features || []).filter((feature) => feature.type === type)
    )
  ).memoized(type);
