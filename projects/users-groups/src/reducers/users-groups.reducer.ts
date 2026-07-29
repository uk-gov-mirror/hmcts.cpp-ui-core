import { createReducer, on } from '@ngrx/store';
import {
  setUserDetails,
  setUserGroups,
  setUserServices,
  setUserPermissions,
  setUserOrganisations,
  setGroupsWithOrganisation,
  setUserFeaturesSuccess
} from '../actions/users-groups.actions';
import {
  UserDetails,
  UserGroup,
  UserService,
  UserRole,
  RolePermission,
  UserOrganisation,
  UserGroupWithOrganisation,
  UserServiceFeature
} from '../users-groups.interfaces';
import { getPermissionsMap } from '../utils';
import { setUserRoles } from '../actions/users-groups.actions';

export interface State {
  userDetails?: UserDetails;
  userGroups?: UserGroup[];
  userRoles?: UserRole[];
  userServices?: UserService[];
  permissionsMap: Record<string, RolePermission>;
  switchableRoles?: UserRole[];
  organisations?: UserOrganisation[];
  groupsWithOrganisation?: UserGroupWithOrganisation[];
  features?: UserServiceFeature[];
}

const initialState: State = {
  permissionsMap: {}
};

export const userGroupsReducer = createReducer(
  initialState,
  on(setUserDetails, (state, { userDetails }) => ({ ...state, userDetails })),
  // action is deprecated and state listener will be removed soon. see setUserPrmissions below.
  on(setUserGroups, (state, { userGroups }) => ({ ...state, userGroups })),
  on(setUserRoles, (state, { userRoles }) => ({ ...state, userRoles })),
  on(setUserServices, (state, { userServices }) => ({ ...state, userServices })),
  on(setUserOrganisations, (state, { organisations }) => ({ ...state, organisations })),
  on(setGroupsWithOrganisation, (state, { groupsWithOrganisation }) => ({
    ...state,
    groupsWithOrganisation
  })),
  on(setUserPermissions, (state, { userGroups, permissions, switchableRoles }) => ({
    ...state,
    userGroups,
    permissionsMap: permissions ? getPermissionsMap(permissions) : {},
    switchableRoles
  })),
  on(setUserFeaturesSuccess, (state, action) => ({
    ...state,
    features: action.userFeatures
  }))
);
