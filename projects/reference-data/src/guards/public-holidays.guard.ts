import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getPublicHolidays, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class PublicHolidaysGuard implements CanActivate {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasPublicHolidaysInStore() {
    return this.store.pipe(
      map(getPublicHolidays),
      map((publicHolidays) => !!publicHolidays),
      take(1)
    );
  }

  hasPublicHolidaysInApi() {
    return this.referenceData.fetchPublicHolidays().pipe(
      tap((publicHolidays) =>
        this.store.dispatch(ReferenceDataActions.loadPublicHolidaysSuccess({ publicHolidays }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasPublicHolidaysInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasPublicHolidaysInApi())),
      tap({
        error: () => {
          if (referenceDataErrorRedirectTo) {
            this.router.navigateByUrl(referenceDataErrorRedirectTo);
          }
        }
      }),
      catchError(() => of(false))
    );
  }
}
