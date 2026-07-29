import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getCPSCaseStatuses, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class CPSCaseStatusGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasCPSCaseStatusesInStore() {
    return this.store.pipe(
      map(getCPSCaseStatuses),
      map((caseStatuses) => !!caseStatuses),
      take(1)
    );
  }

  hasCPSCaseStatusesInApi() {
    return this.referenceData.fetchCPSCaseStatuses().pipe(
      tap((cpsCaseStatuses) =>
        this.store.dispatch(ReferenceDataActions.loadCPSCaseStatusesSuccess({ cpsCaseStatuses }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasCPSCaseStatusesInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasCPSCaseStatusesInApi())),
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
