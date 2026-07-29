import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataService } from '../services/reference-data.service';
import { getOrganisationsWithType, ReferenceDataState } from '../reducers';
import { OrganisationType } from '../reference-data.interfaces';
import { ReferenceDataActions } from '../actions';

export const canActivateOrganisationsWithType: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const orgType = route.queryParams.orgType || route.params.orgType;
  const { referenceDataErrorRedirectTo = '/technical-error' } = route.data as {
    referenceDataErrorRedirectTo?: string;
  };
  const referenceDataService = inject(ReferenceDataService);
  const store = inject(Store<ReferenceDataState>);
  const router = inject(Router);
  return hasOrganisationsWithOrgTypeInStore(orgType, store).pipe(
    switchMap((inStore) =>
      !!inStore ? of(true) : hasOrganisationsWithOrgTypeInApi(orgType, store, referenceDataService)
    ),
    tap({
      error: () => {
        if (referenceDataErrorRedirectTo) {
          router.navigateByUrl(referenceDataErrorRedirectTo);
        }
      }
    }),
    catchError(() => of(false))
  );
};

const hasOrganisationsWithOrgTypeInStore = (
  organisationType: OrganisationType,
  store: Store<ReferenceDataState>
): Observable<boolean | undefined> =>
  store.pipe(
    select(getOrganisationsWithType),
    take(1),
    map(
      (organisationsWithType) =>
        !!organisationsWithType &&
        organisationsWithType.some(({ orgType }) => orgType === organisationType)
    )
  );

const hasOrganisationsWithOrgTypeInApi = (
  orgType: OrganisationType,
  store: Store<ReferenceDataState>,
  service: ReferenceDataService
) =>
  service.fetchOrganisationsWithType(orgType).pipe(
    tap((organisationsWithType) =>
      store.dispatch(
        ReferenceDataActions.loadOrganisationsWithTypeSuccess({ organisationsWithType })
      )
    ),
    mapTo(true)
  );
