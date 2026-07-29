import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { UserDetailsGuard } from './guards/user-details.guard';
import { UserGroupsGuard } from './guards/user-groups.guard';
import { UserServiceExistsGuard } from './guards/user-service-exists.guard';
import { UserServicesGuard } from './guards/user-services.guard';
import { usersGroups } from './reducers/index';
import { UsersGroupsService } from './services/users-groups.service';
import { CppUserHasPermissionDirective } from './permissions/directives/cpp-user-has-permission.directive';
import { UserOrganisationsGuard } from './guards/user-organisations.guard';
import { UserGroupsWithOrganisationGuard } from './guards/user-groups-with-organisation.guard';
import { UserRolesGuard } from './guards/user-roles.guard';
import { UserFeaturesGuard } from './guards/user-features.guard';
import { CppHasFeatureEnabledDirective } from './features/directives/cpp-user-has-feature-enabled.directive';
import { EffectsModule } from '@ngrx/effects';
import { UserGroupsEffects } from './effects/user-groups.effects';
import { SystemAnnouncementsService } from './services/system-announcements.service';
import { UserPermissionsGuard } from './guards/permissions/user-permissions.guard';
import { UserPermissionsExistGuard } from './guards/permissions/user-permissions-exist.guard';

/**
 * @deprecated
 * This will be removed in some release moving forward but is
 * left here for Backward compatilibity.
 *
 * To use users groups remove the module where used.
 * In the app module or Bootstrap function (Standalone) or Route ,
 * provide users groups context using the following as per preference
 *  @method provideUserGroupsEnvironmentContext
 * - This will provide all guards, and services  inclusive of the feature store.
 *  @method provideUsersGroupsStore
 * - You can provide just the feature store using this method in your module or route providers and import the guards you need on demand.
 *
 *
 * PLEASE ENSURE THAT YOUR BOOTSTRAP OR APPMODULE USES THE PROVIDESTORE as the root prior to using any of the methods above mentioned. You can
 * mix StoreModule.forRoot and provideStore if the application is still modular - Please refer to Ngrx docs for details
 *
 * Finally all Users groups directives are standalone and can be imported on demand in the modules or standalone components
 * when needed.
 */
@NgModule({
  imports: [
    StoreModule.forFeature('usersGroups', usersGroups),
    EffectsModule.forFeature([UserGroupsEffects]),
    CppUserHasPermissionDirective,
    CppHasFeatureEnabledDirective
  ],
  providers: [
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
  ],
  exports: [CppUserHasPermissionDirective, CppHasFeatureEnabledDirective]
})
export class UsersGroupsModule {}
