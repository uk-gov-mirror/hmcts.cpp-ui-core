import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getPleaStatusTypes, ReferenceDataState } from '../reducers';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class PleaTypesGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasPleaTypesInStore() {
    return this.store.pipe(
      map(getPleaStatusTypes),
      map((pleaStatusTypes) => pleaStatusTypes.length > 0),
      take(1)
    );
  }

  hasPleaTypesInApi() {
    return this.referenceData.fetchPleaTypes().pipe(
      tap((pleaStatusTypes) =>
        this.store.dispatch(ReferenceDataActions.loadPleaTypesSuccess({ pleaStatusTypes }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasPleaTypesInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasPleaTypesInApi())),
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
