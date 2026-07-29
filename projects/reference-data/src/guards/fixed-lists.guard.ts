import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { ReferenceDataState, getFixedLists } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class FixedListsGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasFixedListsInStore() {
    return this.store.pipe(
      map(getFixedLists),
      map((fixedLists) => fixedLists.length !== 0),
      take(1)
    );
  }

  hasFixedListsInApi() {
    return this.referenceData.fetchFixedLists().pipe(
      tap((fixedLists) =>
        this.store.dispatch(ReferenceDataActions.loadFixedListsSuccess({ fixedLists }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasFixedListsInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasFixedListsInApi())),
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
