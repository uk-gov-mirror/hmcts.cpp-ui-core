import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getProsecutors, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class ProsecutorsGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasProsecutorsInStore() {
    return this.store.pipe(
      map(getProsecutors),
      map((prosecutors) => !!prosecutors),
      take(1)
    );
  }

  hasProsecutorsInApi() {
    return this.referenceData.fetchProsecutors().pipe(
      tap((prosecutors) =>
        this.store.dispatch(ReferenceDataActions.loadProsecutorsSuccess({ prosecutors }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasProsecutorsInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasProsecutorsInApi())),
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
