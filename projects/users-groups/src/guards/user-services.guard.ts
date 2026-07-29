import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { setUserServices } from '../actions/users-groups.actions';
import { getUserServices, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';

@Injectable()
export class UserServicesGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroups: UsersGroupsService
  ) {}

  hasUserServicesInStore() {
    return this.store.pipe(
      select(getUserServices),
      map((services) => !!services),
      take(1)
    );
  }

  hasUserServicesInApi() {
    return this.usersGroups.fetchUserServices().pipe(
      tap((userServices) => this.store.next(setUserServices({ userServices }))),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const { userServicesErrorRedirectTo, serviceUnavailableRedirectTo } = route.data as {
      userServicesErrorRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    };

    return this.hasUserServicesInStore().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(null);
        }
        return this.hasUserServicesInApi();
      }),
      switchMapTo(this.store),
      mapTo(true),
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if ((status === 404 || status === 0) && serviceUnavailableRedirectTo) {
            this.router.navigateByUrl(serviceUnavailableRedirectTo);
            return;
          }

          if (userServicesErrorRedirectTo) {
            this.router.navigateByUrl(userServicesErrorRedirectTo);
          }
        }
      }),
      catchError(() => of(false))
    );
  }
}
