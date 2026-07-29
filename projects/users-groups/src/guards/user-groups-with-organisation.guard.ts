import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { setGroupsWithOrganisation } from '../actions/users-groups.actions';
import { getGroupsWithOrganisation, UsersGroupsState } from '../reducers/index';
import { UsersGroupsService } from '../services/users-groups.service';

@Injectable()
export class UserGroupsWithOrganisationGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private router: Router,
    private usersGroups: UsersGroupsService
  ) {}

  hasGroupsWithOrganisationsInStore() {
    return this.store.pipe(
      select(getGroupsWithOrganisation),
      map(
        (groupsWithOrganisation) => !!groupsWithOrganisation && groupsWithOrganisation.length > 0
      ),
      take(1)
    );
  }

  hasGroupsWithOrganisationsInApi() {
    return this.usersGroups.fetchGroupsWithOrganisation().pipe(
      tap((groupsWithOrganisation) =>
        this.store.next(setGroupsWithOrganisation({ groupsWithOrganisation }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { groupsWithOrganisationsErrorRedirectTo } = route.data as {
      groupsWithOrganisationsErrorRedirectTo?: string;
    };

    return this.hasGroupsWithOrganisationsInStore().pipe(
      switchMap((data) => (data ? of(data) : this.hasGroupsWithOrganisationsInApi())),
      tap({
        error: () =>
          groupsWithOrganisationsErrorRedirectTo &&
          this.router.navigateByUrl(groupsWithOrganisationsErrorRedirectTo)
      }),
      catchError(() => of(false))
    );
  }
}
