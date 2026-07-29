import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { getUserFeatures, UsersGroupsState } from '../reducers/index';
import { UserServiceFeature } from '../users-groups.interfaces';

@Injectable()
export class UserFeatureExistsGuard {
  constructor(private store: Store<UsersGroupsState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { userFeatureExistsErrorRedirectTo, userFeatureExistsPredicate } = route.data as {
      userFeatureExistsPredicate: (userFeatures: UserServiceFeature[]) => boolean;
      userFeatureExistsErrorRedirectTo?: string;
    };

    return this.store.pipe(
      select(getUserFeatures),
      filter((userFeatures): userFeatures is UserServiceFeature[] => !!userFeatures),
      take(1),
      map((userFeatures) => userFeatureExistsPredicate(userFeatures)),
      tap((valid) => {
        if (!valid && userFeatureExistsErrorRedirectTo) {
          this.router.navigateByUrl(userFeatureExistsErrorRedirectTo);
        }
      })
    );
  }
}
