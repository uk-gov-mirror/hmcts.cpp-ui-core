import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getWitnessCareUnits, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class WitnessCareUnitGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasWitnessCareUnitsInStore() {
    return this.store.pipe(
      map(getWitnessCareUnits),
      map((witnessCareUnits) => !!witnessCareUnits),
      take(1)
    );
  }

  hasWitnessCareUnitsInApi() {
    return this.referenceData.fetchWitnessCareUnits().pipe(
      tap((witnessCareUnits) =>
        this.store.dispatch(ReferenceDataActions.loadWitnessCareUnitsSuccess({ witnessCareUnits }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasWitnessCareUnitsInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasWitnessCareUnitsInApi())),
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
