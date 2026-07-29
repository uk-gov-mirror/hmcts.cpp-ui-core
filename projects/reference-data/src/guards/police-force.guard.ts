import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getPoliceForceList, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class PoliceForceListGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasPoliceForceListInStore() {
    return this.store.pipe(
      map(getPoliceForceList),
      map((policeForceList) => !!policeForceList),
      take(1)
    );
  }

  hasPoliceForceListInApi() {
    return this.referenceData.fetchPoliceForceList().pipe(
      tap((policeForceList) =>
        this.store.dispatch(ReferenceDataActions.loadPoliceForceListSuccess({ policeForceList }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasPoliceForceListInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasPoliceForceListInApi())),
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
