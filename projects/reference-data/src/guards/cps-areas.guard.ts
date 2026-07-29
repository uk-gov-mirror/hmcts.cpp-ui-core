import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getCPSAreas, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class CPSAreasGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasCPSAreasInStore() {
    return this.store.pipe(
      map(getCPSAreas),
      map((cpsAreas) => !!cpsAreas),
      take(1)
    );
  }

  hasCPSAreasInInApi() {
    return this.referenceData.fetchCPSAreas().pipe(
      tap((cpsAreas) =>
        this.store.dispatch(ReferenceDataActions.loadCPSAreasSuccess({ cpsAreas }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasCPSAreasInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasCPSAreasInInApi())),
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
