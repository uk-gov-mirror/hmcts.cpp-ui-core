import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { usersGroups } from './reducers';
import { UserDetailsGuard } from './guards/user-details.guard';
import { UserGroupsGuard } from './guards/user-groups.guard';
import { UserRolesGuard } from './guards/user-roles.guard';
import { UserServiceExistsGuard } from './guards/user-service-exists.guard';
import { UserServicesGuard } from './guards/user-services.guard';
import { UserOrganisationsGuard } from './guards/user-organisations.guard';
import { UserGroupsWithOrganisationGuard } from './guards/user-groups-with-organisation.guard';
import { UsersGroupsService } from './services/users-groups.service';
import { UserFeaturesGuard } from './guards/user-features.guard';
import { SystemAnnouncementsService } from './services/system-announcements.service';
import { UserPermissionsGuard } from './guards/permissions/user-permissions.guard';
import { UserPermissionsExistGuard } from './guards/permissions/user-permissions-exist.guard';

export const provideUsersGroupsStore = (): EnvironmentProviders => {
  return provideState({ name: 'usersGroups', reducer: usersGroups });
};
export const provideUserGroupsEnvironmentContext = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideUsersGroupsStore(),
    UserDetailsGuard,
    UserGroupsGuard,
    UserRolesGuard,
    UserServiceExistsGuard,
    UserServicesGuard,
    UserOrganisationsGuard,
    UserGroupsWithOrganisationGuard,
    UsersGroupsService,
    UserFeaturesGuard,
    SystemAnnouncementsService,
    UserPermissionsGuard,
    UserPermissionsExistGuard
  ]);
};
