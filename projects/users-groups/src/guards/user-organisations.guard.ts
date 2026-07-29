import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { setUserOrganisations } from '../actions/users-groups.actions';
import { getUserOrganisations, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';

@Injectable()
export class UserOrganisationsGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroups: UsersGroupsService
  ) {}

  hasUserOrganisationsInStore() {
    return this.store.pipe(
      select(getUserOrganisations),
      map((organisations) => !!organisations && organisations.length > 0),
      take(1)
    );
  }

  hasUserOrganisationsInApi() {
    return this.usersGroups.fetchOrganisations().pipe(
      tap((organisations) => this.store.next(setUserOrganisations({ organisations }))),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { userOrganisationsErrorRedirectTo } = route.data as {
      userOrganisationsErrorRedirectTo?: string;
    };

    return this.hasUserOrganisationsInStore().pipe(
      switchMap((data) => (data ? of(data) : this.hasUserOrganisationsInApi())),
      tap({
        error: () =>
          userOrganisationsErrorRedirectTo &&
          this.router.navigateByUrl(userOrganisationsErrorRedirectTo)
      }),
      catchError(() => of(false))
    );
  }
}
