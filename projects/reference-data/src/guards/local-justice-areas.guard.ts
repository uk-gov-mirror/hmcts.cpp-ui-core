import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getLocalJusticeAreas, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class LocalJusticeAreasGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasLocalJusticeAreasInStore() {
    return this.store.pipe(
      map(getLocalJusticeAreas),
      map((localJusticeAreas) => !!localJusticeAreas),
      take(1)
    );
  }

  hasLocalJusticeAreasInApi() {
    return this.referenceData.fetchLocalJusticAreas().pipe(
      tap((localJusticeAreas) =>
        this.store.dispatch(
          ReferenceDataActions.loadLocalJusticeAreasSuccess({ localJusticeAreas })
        )
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasLocalJusticeAreasInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasLocalJusticeAreasInApi())),
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
