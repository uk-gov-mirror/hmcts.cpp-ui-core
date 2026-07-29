import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getTrialTypes, ReferenceDataState } from '../reducers';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class TrialTypesGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasTrialTypesInStore() {
    return this.store.pipe(
      map(getTrialTypes),
      map((trialTypes) => trialTypes.length > 0),
      take(1)
    );
  }

  hasTrialTypesInApi() {
    return this.referenceData.fetchTrialTypes().pipe(
      tap((trialTypes) =>
        this.store.dispatch(ReferenceDataActions.loadTrialTypesSuccess({ trialTypes }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasTrialTypesInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasTrialTypesInApi())),
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
