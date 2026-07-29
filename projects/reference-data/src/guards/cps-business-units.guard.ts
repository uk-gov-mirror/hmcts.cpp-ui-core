import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getCPSBusinessUnits, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class CPSBusinessUnitsGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasCPSBusinessUnitsInStore() {
    return this.store.pipe(
      map(getCPSBusinessUnits),
      map((businessUnits) => !!businessUnits),
      take(1)
    );
  }

  hasCPSBusinessUnitsInApi() {
    return this.referenceData.fetchCPSBusinessUnits().pipe(
      tap((cpsBusinessUnits) =>
        this.store.dispatch(ReferenceDataActions.loadCPSBusinessUnitsSuccess({ cpsBusinessUnits }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasCPSBusinessUnitsInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasCPSBusinessUnitsInApi())),
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
