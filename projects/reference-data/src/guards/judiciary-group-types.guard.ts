import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getJudiciaryGroupTypes, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class JudiciaryGroupTypesGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasJudiciaryGroupTypesInStore() {
    return this.store.pipe(
      map(getJudiciaryGroupTypes),
      map((judiciaryGroupTypes) => !!judiciaryGroupTypes),
      take(1)
    );
  }

  hasJudiciaryGroupTypesInApi() {
    return this.referenceData.fetchJudiciaryGroupTypes().pipe(
      tap((judiciaryGroupTypes) =>
        this.store.dispatch(
          ReferenceDataActions.loadJudiciaryGroupTypesSuccess({ judiciaryGroupTypes })
        )
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasJudiciaryGroupTypesInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasJudiciaryGroupTypesInApi())),
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
