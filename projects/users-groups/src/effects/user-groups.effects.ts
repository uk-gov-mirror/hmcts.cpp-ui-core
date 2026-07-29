import { Injectable } from '@angular/core';
import { Observable, timer, of } from 'rxjs';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UsersGroupsService } from '../services/users-groups.service';
import {
  setUserFeatures,
  setUserFeaturesSuccess,
  setUserFeaturesError
} from '../actions/users-groups.actions';
import { switchMap, exhaustMap, map, catchError, retryWhen } from 'rxjs/operators';

@Injectable()
export class UserGroupsEffects {
  // This should be done in the BE using Azure durable functions and a form
  // of notification triggered to the front end  to mitigate performance issues.
  // At this stage the FE shouldn't handle these kind of requests.
  // However given that the design had already been
  // agreed upon, it was insisted that the FE should handle this polling requests
  startFeaturesPolling$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserFeatures),
      switchMap(({ pollingInterval = 600000 }) =>
        timer(0, pollingInterval).pipe(
          exhaustMap(() =>
            this.usersGroups.fetchUserFeatures().pipe(
              map((userFeatures) => setUserFeaturesSuccess({ userFeatures })),
              catchError((error) => of(setUserFeaturesError({ error })))
            )
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private usersGroups: UsersGroupsService) {}
}
