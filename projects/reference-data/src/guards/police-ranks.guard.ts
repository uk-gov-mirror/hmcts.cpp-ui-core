import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, switchMap, tap, take, map } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions';
import { getPoliceRanks, ReferenceDataState } from '../reducers';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class PoliceRanksGuard implements CanActivate {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasPoliceRanksInStore() {
    return this.store.pipe(
      map(getPoliceRanks),
      map(policeRanks => !!policeRanks && !!policeRanks.length),
      take(1)
    );
  }

  hasPoliceRanksInApi() {
    return this.referenceData.fetchPoliceRanks().pipe(
      tap(policeRanks =>
        this.store.dispatch(ReferenceDataActions.loadPoliceRanksSuccess({ policeRanks }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasPoliceRanksInStore().pipe(
      switchMap(hasInStore => (hasInStore ? of(true) : this.hasPoliceRanksInApi())),
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
