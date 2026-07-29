import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { DynatraceService } from '@cpp/core';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { setUserGroups } from '../actions/users-groups.actions';
import { getUserGroups, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';

@Injectable()
export class UserGroupsGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroups: UsersGroupsService,
    private dynatraceService: DynatraceService
  ) {}

  hasUserGroupsInStore() {
    return this.store.pipe(
      select(getUserGroups),
      map((groups) => !!groups),
      take(1)
    );
  }

  hasUserGroupsInApi() {
    return this.usersGroups.fetchUserGroups().pipe(
      tap((userGroups) => {
        const groupNames = (userGroups || []).map((group) => group.groupName);
        this.dynatraceService.trackUserGroups(groupNames);
        return this.store.next(setUserGroups({ userGroups }));
      }),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const { userGroupsErrorRedirectTo, serviceUnavailableRedirectTo } = route.data as {
      userGroupsErrorRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    };

    return this.hasUserGroupsInStore().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(null);
        }
        return this.hasUserGroupsInApi();
      }),
      switchMapTo(this.store),
      mapTo(true),
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if ((status === 404 || status === 0) && serviceUnavailableRedirectTo) {
            this.router.navigateByUrl(serviceUnavailableRedirectTo);
            return;
          }
          if (userGroupsErrorRedirectTo) {
            this.router.navigateByUrl(userGroupsErrorRedirectTo);
          }
        }
      }),
      catchError(() => of(false))
    );
  }
}
