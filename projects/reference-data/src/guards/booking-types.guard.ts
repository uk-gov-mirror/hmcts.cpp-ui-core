import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import { getBookingTypes, ReferenceDataState } from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';

@Injectable()
export class BookingTypesGuard {
  constructor(
    private referenceData: ReferenceDataService,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  hasBookingTypesInStore() {
    return this.store.pipe(
      map(getBookingTypes),
      map((bookingTypes) => !!bookingTypes),
      take(1)
    );
  }

  hasBookingTypesInApi() {
    return this.referenceData.fetchBookingTypes().pipe(
      tap((bookingTypes) =>
        this.store.dispatch(ReferenceDataActions.loadBookingTypesSuccess({ bookingTypes }))
      ),
      mapTo(true)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const { referenceDataErrorRedirectTo } = route.data as {
      referenceDataErrorRedirectTo?: string;
    };
    return this.hasBookingTypesInStore().pipe(
      switchMap((hasInStore) => (hasInStore ? of(true) : this.hasBookingTypesInApi())),
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
