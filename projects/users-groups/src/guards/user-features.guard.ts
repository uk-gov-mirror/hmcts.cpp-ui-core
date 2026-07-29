import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { setUserFeaturesSuccess } from '../actions/users-groups.actions';
import { getUserFeatures, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';

@Injectable()
export class UserFeaturesGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroupsService: UsersGroupsService
  ) {}

  hasUserFeaturesInStore() {
    return this.store.pipe(
      select(getUserFeatures),
      map((features) => !!features),
      take(1)
    );
  }

  hasUserFeaturesInApi() {
    return this.usersGroupsService.fetchUserFeatures().pipe(
      tap((userFeatures) => this.store.next(setUserFeaturesSuccess({ userFeatures }))),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const { userFeaturesErrorRedirectTo, serviceUnavailableRedirectTo } = route.data as {
      userFeaturesErrorRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    };

    return this.hasUserFeaturesInStore().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(null);
        }
        return this.hasUserFeaturesInApi();
      }),
      mapTo(true),
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if ((status === 404 || status === 0) && serviceUnavailableRedirectTo) {
            this.router.navigateByUrl(serviceUnavailableRedirectTo);
            return;
          }

          if (userFeaturesErrorRedirectTo) {
            this.router.navigateByUrl(userFeaturesErrorRedirectTo);
          }
        }
      }),
      catchError(() => of(false))
    );
  }
}
