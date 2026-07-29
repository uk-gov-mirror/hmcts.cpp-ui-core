import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UsersGroupsState, getUserRolePermissions } from '../../reducers';
import { map, tap, filter } from 'rxjs/operators';
import { AggregatedRolePermission } from '../../users-groups.interfaces';

export type UserPermissionsExist = (rolePermissions: AggregatedRolePermission[]) => boolean;

@Injectable()
export class UserPermissionsExistGuard {
  constructor(private store: Store<UsersGroupsState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { userPermissionsExistsPredicate, userPermissionsExistsErrorRedirectTo } = (route.data ||
      {}) as {
      userPermissionsExistsErrorRedirectTo: string;
      userPermissionsExistsPredicate: UserPermissionsExist;
    };

    return this.store.pipe(
      select(getUserRolePermissions),
      filter((rolePermissions): rolePermissions is AggregatedRolePermission[] => !!rolePermissions),
      map((rolePermissions) => userPermissionsExistsPredicate(rolePermissions)),
      tap((permissionExist) => {
        if (!permissionExist && userPermissionsExistsErrorRedirectTo) {
          this.router.navigateByUrl(userPermissionsExistsErrorRedirectTo);
        }
      })
    );
  }
}
