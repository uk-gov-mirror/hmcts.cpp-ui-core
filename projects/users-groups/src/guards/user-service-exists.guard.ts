import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { getUserServices, UsersGroupsState } from '../reducers/index';
import { UserService } from '../users-groups.interfaces';

@Injectable()
export class UserServiceExistsGuard {
  constructor(private store: Store<UsersGroupsState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { userServiceExistsErrorRedirectTo, userServiceExistsPredicate } = route.data as {
      userServiceExistsPredicate: (userServices: UserService[]) => boolean;
      userServiceExistsErrorRedirectTo?: string;
    };

    return this.store.pipe(
      select(getUserServices),
      filter((userServices) => !!userServices),
      take(1),
      map((userServices) => userServiceExistsPredicate(userServices!)),
      tap((valid) => {
        if (!valid && userServiceExistsErrorRedirectTo) {
          this.router.navigateByUrl(userServiceExistsErrorRedirectTo);
        }
      })
    );
  }
}
