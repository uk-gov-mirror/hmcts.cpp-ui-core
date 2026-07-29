import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { setUserRoles } from '../actions/users-groups.actions';
import { getUserRoles, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';

@Injectable()
export class UserRolesGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroups: UsersGroupsService
  ) {}

  hasUserRolesInStore() {
    return this.store.pipe(
      select(getUserRoles),
      map((groups) => !!groups),
      take(1)
    );
  }

  hasUserRolesInApi() {
    return this.usersGroups
      .fetchUserSelectedRoles()
      .pipe(
        tap(({ allRoles }) => this.store.next(setUserRoles({ userRoles: allRoles })), mapTo(true))
      );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const { userRolesErrorRedirectTo, serviceUnavailableRedirectTo } = route.data as {
      userRolesErrorRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    };

    return this.hasUserRolesInStore().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(null);
        }
        return this.hasUserRolesInApi();
      }),
      switchMapTo(this.store),
      mapTo(true),
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if ((status === 404 || status === 0) && serviceUnavailableRedirectTo) {
            this.router.navigateByUrl(serviceUnavailableRedirectTo);
            return;
          }

          if (userRolesErrorRedirectTo) {
            this.router.navigateByUrl(userRolesErrorRedirectTo);
          }
        }
      }),
      catchError(() => of(false))
    );
  }
}
