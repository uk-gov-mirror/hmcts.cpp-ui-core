import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DynatraceService } from '@cpp/core';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { setUserDetails } from '../actions/users-groups.actions';
import { getUserDetails, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserDetailsGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroups: UsersGroupsService,
    private dynatraceService: DynatraceService
  ) {}

  hasUserDetailsInStore() {
    return this.store.pipe(select(getUserDetails), map(Boolean), take(1));
  }

  hasUserDetailsInApi() {
    return this.usersGroups.fetchLoggedInUserDetails().pipe(
      tap((userDetails) => {
        this.dynatraceService.trackUserName(userDetails.email);
        return this.store.next(setUserDetails({ userDetails }));
      }),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const { userDetailsErrorRedirectTo, serviceUnavailableRedirectTo } = route.data as {
      userDetailsErrorRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    };

    return this.hasUserDetailsInStore().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(null);
        }
        return this.hasUserDetailsInApi();
      }),
      switchMapTo(this.store),
      mapTo(true),
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if ((status === 404 || status === 0) && serviceUnavailableRedirectTo) {
            this.router.navigateByUrl(serviceUnavailableRedirectTo);
            return;
          }

          if (userDetailsErrorRedirectTo) {
            this.router.navigateByUrl(userDetailsErrorRedirectTo);
          }
        }
      }),
      catchError(() => of(false))
    );
  }
}
