import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getSpecialRequirements, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class SpecialRequirementsGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasSpecialRequirementsInStore() {
    return this.store.pipe(
      map(getSpecialRequirements),
      map((specialRequirements) => !!specialRequirements),
      take(1)
    );
  }

  hasSpecialRequirementsInApi() {
    return this.referenceData.fetchSpecialRequirements().pipe(
      tap((specialRequirements) =>
        this.store.dispatch(
          ReferenceDataActions.loadSpecialRequirementsSuccess({ specialRequirements })
        )
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasSpecialRequirementsInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasSpecialRequirementsInApi())),
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
