import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UsersGroupsState, getUserRolePermissions } from '../../reducers';
import { map, tap, switchMap, catchError, take } from 'rxjs/operators';
import { UsersGroupsService } from '../../services/users-groups.service';
import { setUserPermissions } from '../../actions/users-groups.actions';
import { HttpErrorResponse } from '@angular/common/http';

interface RedirectToRoutes {
  userPermissionsErrorRedirectTo?: string;
  userNoPermissionsRedirectTo?: string;
  serviceUnavailableRedirectTo?: string;
}

@Injectable()
export class UserPermissionsGuard {
  constructor(
    private store: Store<UsersGroupsState>,
    private usersGroupsService: UsersGroupsService,
    private router: Router
  ) {}

  hasUserPermissionsInStore(): Observable<boolean> {
    return this.store.pipe(
      select(getUserRolePermissions),
      map((rolePermissions) => !!rolePermissions && rolePermissions.length > 0),
      take(1)
    );
  }

  hasUsersPermissionsInApi(): Observable<boolean> {
    return this.usersGroupsService.fetchUserPermissions().pipe(
      tap(({ groups: userGroups, permissions, switchableRoles }) => {
        this.store.dispatch(setUserPermissions({ userGroups, permissions, switchableRoles }));
      }),
      map(({ permissions }) => !!permissions),
      take(1)
    );
  }

  permissionsErrorRedirectRouteObserver = ({
    userPermissionsErrorRedirectTo,
    userNoPermissionsRedirectTo,
    serviceUnavailableRedirectTo
  }: RedirectToRoutes) => ({
    next: (hasPermissions: boolean) => {
      if (!hasPermissions && userNoPermissionsRedirectTo) {
        this.router.navigateByUrl(userNoPermissionsRedirectTo);
      }
    },
    error: ({ status }: HttpErrorResponse) => {
      if ((status === 404 || status === 0) && serviceUnavailableRedirectTo) {
        this.router.navigateByUrl(serviceUnavailableRedirectTo);
        return;
      }

      if (userPermissionsErrorRedirectTo) {
        this.router.navigateByUrl(userPermissionsErrorRedirectTo);
      }
    }
  });

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const {
      userPermissionsErrorRedirectTo,
      userNoPermissionsRedirectTo,
      serviceUnavailableRedirectTo
    } = (route.data || {}) as {
      userPermissionsErrorRedirectTo?: string;
      userNoPermissionsRedirectTo?: string;
      serviceUnavailableRedirectTo?: string;
    };

    const routerCurrentNavigation = this.router.getCurrentNavigation();
    const { ignoreUserPermissionsFromStore } = ((!!routerCurrentNavigation &&
      routerCurrentNavigation.extras.state) ||
      {}) as {
      ignoreUserPermissionsFromStore: boolean;
    };

    if (ignoreUserPermissionsFromStore) {
      return this.hasUsersPermissionsInApi().pipe(
        tap(
          this.permissionsErrorRedirectRouteObserver({
            userPermissionsErrorRedirectTo,
            userNoPermissionsRedirectTo,
            serviceUnavailableRedirectTo
          })
        ),
        catchError(() => of(false))
      );
    }

    return this.hasUserPermissionsInStore().pipe(
      switchMap((hasPermissions) =>
        hasPermissions ? of(hasPermissions) : this.hasUsersPermissionsInApi()
      ),
      tap(
        this.permissionsErrorRedirectRouteObserver({
          userPermissionsErrorRedirectTo,
          userNoPermissionsRedirectTo,
          serviceUnavailableRedirectTo
        })
      ),
      catchError(() => of(false))
    );
  }
}
