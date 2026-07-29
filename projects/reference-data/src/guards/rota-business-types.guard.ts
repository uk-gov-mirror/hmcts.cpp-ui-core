import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getRotaBusinessTypes, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class RotaBusinessTypesGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasRotaBusinessTypesInStore() {
    return this.store.pipe(
      map(getRotaBusinessTypes),
      map((rotaBusinessTypes) => rotaBusinessTypes.length > 0),
      take(1)
    );
  }

  hasRotaBusinessTypesInApi() {
    return this.referenceData.fetchRotaBusinessTypes().pipe(
      tap((rotaBusinessTypes) =>
        this.store.dispatch(
          ReferenceDataActions.loadRotaBusinessTypesSuccess({ rotaBusinessTypes })
        )
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasRotaBusinessTypesInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasRotaBusinessTypesInApi())),
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
