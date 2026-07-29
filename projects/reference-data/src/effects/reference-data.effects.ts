import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { ReferenceDataActions } from '../actions/index';
import {
  getApplicationTypes,
  getAssignPriorities,
  getPublicHolidays,
  getBookingTypes,
  getClusters,
  getCPSAreas,
  getCPSBusinessUnits,
  getCPSCaseStatuses,
  getFixedLists,
  getHearingTypes,
  getOrganisationUnits,
  getPleaStatusTypes,
  getPoliceForceList,
  getPoliceRanks,
  getProsecutors,
  getTrialTypes,
  getWitnessCareUnits,
  ReferenceDataState,
  getOrganisationsWithType,
  getRotaBusinessTypes
} from '../reducers/index';
import { ReferenceDataService } from '../services/reference-data.service';
import { OrganisationType } from '../reference-data.interfaces';

@Injectable()
export class ReferenceDataEffects {
  fetchApplicationTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadApplicationTypes),
      withLatestFrom(this.store),
      filter(([, state]) => !getApplicationTypes(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchApplicationTypes().pipe(
          map((applicationTypes) =>
            ReferenceDataActions.loadApplicationTypesSuccess({ applicationTypes })
          ),
          catchError((error) => of(ReferenceDataActions.loadApplicationTypesError({ error })))
        )
      )
    )
  );

  fetchAssignPriorities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadAssignPriorities),
      withLatestFrom(this.store),
      filter(([, state]) => !getAssignPriorities(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchAssignPriorities().pipe(
          map((assignPriorities) =>
            ReferenceDataActions.loadAssignPrioritiesSuccess({ assignPriorities })
          ),
          catchError((error) => of(ReferenceDataActions.loadAssignPrioritiesError({ error })))
        )
      )
    )
  );

  fetchBookingTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadBookingTypes),
      withLatestFrom(this.store),
      filter(([, state]) => !getBookingTypes(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchBookingTypes().pipe(
          map((bookingTypes) => ReferenceDataActions.loadBookingTypesSuccess({ bookingTypes })),
          catchError((error) => of(ReferenceDataActions.loadBookingTypesError({ error })))
        )
      )
    )
  );

  fetchClusters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadClusters),
      withLatestFrom(this.store),
      filter(([, state]) => !getClusters(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchClusters().pipe(
          map((clusters) => ReferenceDataActions.loadClustersSuccess({ clusters })),
          catchError((error) => of(ReferenceDataActions.loadClustersError({ error })))
        )
      )
    )
  );

  fetchCPSAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadCPSAreas),
      withLatestFrom(this.store),
      filter(([, state]) => !getCPSAreas(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchCPSAreas().pipe(
          map((cpsAreas) => ReferenceDataActions.loadCPSAreasSuccess({ cpsAreas })),
          catchError((error) => of(ReferenceDataActions.loadCPSAreasError({ error })))
        )
      )
    )
  );

  fetchCPSBusinessUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadCPSBusinessUnits),
      withLatestFrom(this.store),
      filter(([, state]) => !getCPSBusinessUnits(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchCPSBusinessUnits().pipe(
          map((cpsBusinessUnits) =>
            ReferenceDataActions.loadCPSBusinessUnitsSuccess({ cpsBusinessUnits })
          ),
          catchError((error) => of(ReferenceDataActions.loadCPSBusinessUnitsError({ error })))
        )
      )
    )
  );

  fetchCPSCaseStatuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadCPSCaseStatuses),
      withLatestFrom(this.store),
      filter(([, state]) => !getCPSCaseStatuses(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchCPSCaseStatuses().pipe(
          map((cpsCaseStatuses) =>
            ReferenceDataActions.loadCPSCaseStatusesSuccess({ cpsCaseStatuses })
          ),
          catchError((error) => of(ReferenceDataActions.loadCPSCaseStatusesError({ error })))
        )
      )
    )
  );

  fetchFixedLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadFixedLists),
      withLatestFrom(this.store),
      filter(([, state]) => getFixedLists(state).length === 0),
      exhaustMap(() =>
        this.referenceDataService.fetchFixedLists().pipe(
          map((fixedLists) => ReferenceDataActions.loadFixedListsSuccess({ fixedLists })),
          catchError((error) => of(ReferenceDataActions.loadFixedListsError({ error })))
        )
      )
    )
  );

  fetchOrganisationUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadOrganisationUnits),
      withLatestFrom(this.store),
      filter(([, state]) => !getOrganisationUnits(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchOrganisationUnits().pipe(
          map((organisationUnits) =>
            ReferenceDataActions.loadOrganisationUnitsSuccess({ organisationUnits })
          ),
          catchError((error) => of(ReferenceDataActions.loadOrganisationUnitsError({ error })))
        )
      )
    )
  );

  fetchHearingTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadHearingTypes),
      withLatestFrom(this.store),
      filter(([, state]) => !getHearingTypes(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchHearingTypes().pipe(
          map((hearingTypes) => ReferenceDataActions.loadHearingTypesSuccess({ hearingTypes })),
          catchError((error) => of(ReferenceDataActions.loadHearingTypesError({ error })))
        )
      )
    )
  );

  fetchPoliceForceList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadPoliceForceList),
      withLatestFrom(this.store),
      filter(([, state]) => !getPoliceForceList(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchPoliceForceList().pipe(
          map((policeForceList) =>
            ReferenceDataActions.loadPoliceForceListSuccess({ policeForceList })
          ),
          catchError((error) => of(ReferenceDataActions.loadPoliceForceListError({ error })))
        )
      )
    )
  );

  fetchProsecutors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadProsecutors),
      withLatestFrom(this.store),
      filter(([, state]) => !getProsecutors(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchProsecutors().pipe(
          map((prosecutors) => ReferenceDataActions.loadProsecutorsSuccess({ prosecutors })),
          catchError((error) => of(ReferenceDataActions.loadProsecutorsError({ error })))
        )
      )
    )
  );

  fetchPleaTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadPleaTypes),
      withLatestFrom(this.store),
      filter(([, state]) => getPleaStatusTypes(state).length === 0),
      exhaustMap(() =>
        this.referenceDataService.fetchPleaTypes().pipe(
          map((pleaStatusTypes) => ReferenceDataActions.loadPleaTypesSuccess({ pleaStatusTypes })),
          catchError((error) => of(ReferenceDataActions.loadPleaTypesError({ error })))
        )
      )
    )
  );

  fetchWitnessCareUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadWitnessCareUnits),
      withLatestFrom(this.store),
      filter(([, state]) => !getWitnessCareUnits(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchWitnessCareUnits().pipe(
          map((witnessCareUnits) =>
            ReferenceDataActions.loadWitnessCareUnitsSuccess({ witnessCareUnits })
          ),
          catchError((error) => of(ReferenceDataActions.loadWitnessCareUnitsError({ error })))
        )
      )
    )
  );

  fetchTrialTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadTrialTypes),
      withLatestFrom(this.store),
      filter(([, state]) => getTrialTypes(state).length === 0),
      exhaustMap(() =>
        this.referenceDataService.fetchTrialTypes().pipe(
          map((trialTypes) => ReferenceDataActions.loadTrialTypesSuccess({ trialTypes })),
          catchError((error) => of(ReferenceDataActions.loadTrialTypesError({ error })))
        )
      )
    )
  );

  fetchPoliceRanks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadPoliceRanks),
      withLatestFrom(this.store),
      filter(([, state]) => getPoliceRanks(state).length === 0),
      exhaustMap(() =>
        this.referenceDataService.fetchPoliceRanks().pipe(
          map((policeRanks) => ReferenceDataActions.loadPoliceRanksSuccess({ policeRanks })),
          catchError((error) => of(ReferenceDataActions.loadPoliceRanksError({ error })))
        )
      )
    )
  );
  fetchPublicHolidays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadPublicHolidays),
      withLatestFrom(this.store),
      filter(([, state]) => !getPublicHolidays(state)),
      exhaustMap(() =>
        this.referenceDataService.fetchPublicHolidays().pipe(
          map((publicHolidays) =>
            ReferenceDataActions.loadPublicHolidaysSuccess({ publicHolidays })
          ),
          catchError((error) => of(ReferenceDataActions.loadPublicHolidaysError({ error })))
        )
      )
    )
  );

  fetchOrganisationsWithType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadOrganisationsWithType),
      withLatestFrom(this.store),
      filter(([, state]) => !getOrganisationsWithType(state)),
      exhaustMap(([{ organisationType }]) =>
        this.referenceDataService.fetchOrganisationsWithType(organisationType).pipe(
          map((organisationsWithType) =>
            ReferenceDataActions.loadOrganisationsWithTypeSuccess({ organisationsWithType })
          ),
          catchError((error) => of(ReferenceDataActions.loadOrganisationsWithTypeError({ error })))
        )
      )
    )
  );

  fetchRotaBusinessTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenceDataActions.loadRotaBusinessTypes),
      withLatestFrom(this.store),
      filter(([, state]) => getRotaBusinessTypes(state).length === 0),
      exhaustMap(() =>
        this.referenceDataService.fetchRotaBusinessTypes().pipe(
          map((rotaBusinessTypes) =>
            ReferenceDataActions.loadRotaBusinessTypesSuccess({ rotaBusinessTypes })
          ),
          catchError((error) => of(ReferenceDataActions.loadRotaBusinessTypesError({ error })))
        )
      )
    )
  );

  constructor(
    private referenceDataService: ReferenceDataService,
    private actions$: Actions,
    private store: Store<ReferenceDataState>
  ) {}
}
