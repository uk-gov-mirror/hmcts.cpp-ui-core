import { createAction, props } from '@ngrx/store';
import {
  UserDetails,
  UserGroup,
  UserService,
  RolePermission,
  UserRole,
  UserOrganisation,
  UserGroupWithOrganisation,
  UserServiceFeature
} from '../users-groups.interfaces';
import { HttpErrorResponse } from '@angular/common/http';

export const setUserDetails = createAction(
  'SET_USER_DETAILS',
  props<{ userDetails: UserDetails }>()
);

/**@deprecated use the method, setUserPermissions, action instead. */
export const setUserGroups = createAction('SET_USER_GROUPS', props<{ userGroups: UserGroup[] }>());

export const setUserRoles = createAction('SET_USER_ROLES', props<{ userRoles: UserRole[] }>());

export const setUserServices = createAction(
  'SET_USER_SERVICES',
  props<{ userServices: UserService[] }>()
);

export const setUserOrganisations = createAction(
  'SET_USER_ORGANISATIONS',
  props<{ organisations: UserOrganisation[] }>()
);

export const setGroupsWithOrganisation = createAction(
  'SET_GROUPS_WITH_ORGANISATION',
  props<{ groupsWithOrganisation: UserGroupWithOrganisation[] }>()
);

export const setUserPermissions = createAction(
  'SET_USER_PERMISSIONS',
  props<{
    userGroups?: UserGroup[];
    permissions?: RolePermission[];
    switchableRoles?: UserRole[];
  }>()
);

export const setUserFeatures = createAction(
  'SET_USER_FEATURES',
  props<{ pollingInterval?: number }>()
);

export const setUserFeaturesSuccess = createAction(
  'SET_USER_FEATURES_SUCCESS',
  props<{ userFeatures: UserServiceFeature[] }>()
);

export const setUserFeaturesError = createAction(
  'SET_USER_FEATURES_ERROR',
  props<{ error: HttpErrorResponse }>()
);
