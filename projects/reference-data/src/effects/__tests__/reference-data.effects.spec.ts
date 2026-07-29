import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { ReferenceDataActions } from '../../actions';
import { referenceDataReducer, ReferenceDataState } from '../../reducers/index';
import { ReferenceDataService } from '../../services/reference-data.service';
import { ReferenceDataEffects } from '../reference-data.effects';
import { FixedList, OrganisationType } from '../../reference-data.interfaces';

describe('ReferenceDataEffects', () => {
  let actions$: Observable<any>;
  let effects: ReferenceDataEffects;
  let fetchApplicationTypes: jest.Mock;
  let fetchAssignPriorities: jest.Mock;
  let fetchBookingTypes: jest.Mock;
  let fetchClusters: jest.Mock;
  let fetchCPSAreas: jest.Mock;
  let fetchCPSBusinessUnits: jest.Mock;
  let fetchCPSCaseStatuses: jest.Mock;
  let fetchFixedLists: jest.Mock;
  let fetchHearingTypes: jest.Mock;
  let fetchOrganisationUnits: jest.Mock;
  let fetchPoliceForceList: jest.Mock;
  let fetchProsecutors: jest.Mock;
  let fetchPleaTypes: jest.Mock;
  let fetchWitnessCareUnits: jest.Mock;
  let fetchTrialTypes: jest.Mock;
  let fetchPoliceRanks: jest.Mock;
  let fetchPublicHolidays: jest.Mock;
  let fetchOrganisationsWithType: jest.Mock;
  let fetchRotaBusinessTypes: jest.Mock;

  let store: Store<ReferenceDataState>;

  beforeEach(() => {
    fetchApplicationTypes = jest.fn();
    fetchAssignPriorities = jest.fn();
    fetchBookingTypes = jest.fn();
    fetchClusters = jest.fn();
    fetchCPSAreas = jest.fn();
    fetchCPSBusinessUnits = jest.fn();
    fetchCPSCaseStatuses = jest.fn();
    fetchFixedLists = jest.fn();
    fetchHearingTypes = jest.fn();
    fetchOrganisationUnits = jest.fn();
    fetchPoliceForceList = jest.fn();
    fetchProsecutors = jest.fn();
    fetchPleaTypes = jest.fn();
    fetchWitnessCareUnits = jest.fn();
    fetchTrialTypes = jest.fn();
    fetchPoliceRanks = jest.fn();
    fetchPublicHolidays = jest.fn();
    fetchOrganisationsWithType = jest.fn();
    fetchRotaBusinessTypes = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            referenceData: referenceDataReducer
          },
          {
            runtimeChecks: {}
          }
        )
      ],
      providers: [
        ReferenceDataEffects,
        {
          provide: ReferenceDataService,
          useValue: {
            fetchApplicationTypes,
            fetchAssignPriorities,
            fetchBookingTypes,
            fetchClusters,
            fetchCPSAreas,
            fetchCPSBusinessUnits,
            fetchCPSCaseStatuses,
            fetchFixedLists,
            fetchHearingTypes,
            fetchOrganisationUnits,
            fetchPleaTypes,
            fetchPoliceForceList,
            fetchProsecutors,
            fetchWitnessCareUnits,
            fetchTrialTypes,
            fetchPoliceRanks,
            fetchPublicHolidays,
            fetchOrganisationsWithType,
            fetchRotaBusinessTypes
          }
        },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ReferenceDataEffects);
    store = TestBed.inject(Store);
  });

  describe('fetchApplicationTypes$', () => {
    it(
      'should fetch the application types from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadApplicationTypes();
        const successAction = ReferenceDataActions.loadApplicationTypesSuccess({
          applicationTypes: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchApplicationTypes.mockReturnValue(response$);

        m.expect(effects.fetchApplicationTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any further actions while fetching the application types is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadApplicationTypes();
        const successAction = ReferenceDataActions.loadApplicationTypesSuccess({
          applicationTypes: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchApplicationTypes.mockReturnValue(response$);

        m.expect(effects.fetchApplicationTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the application types are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadApplicationTypesSuccess({
          applicationTypes: []
        });

        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchApplicationTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the application types fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadApplicationTypes();
        const errorAction = ReferenceDataActions.loadApplicationTypesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchApplicationTypes.mockReturnValue(response$);

        m.expect(effects.fetchApplicationTypes$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchAssignPriorities$', () => {
    it(
      'should fetch the assign priorities from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadAssignPriorities();
        const successAction = ReferenceDataActions.loadAssignPrioritiesSuccess({
          assignPriorities: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchAssignPriorities.mockReturnValue(response$);

        m.expect(effects.fetchAssignPriorities$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any further actions while fetching the assign priorities is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadAssignPriorities();
        const successAction = ReferenceDataActions.loadAssignPrioritiesSuccess({
          assignPriorities: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchAssignPriorities.mockReturnValue(response$);

        m.expect(effects.fetchAssignPriorities$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the assign priorities are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadAssignPrioritiesSuccess({
          assignPriorities: []
        });

        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchAssignPriorities$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the assign priorities fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadAssignPriorities();
        const errorAction = ReferenceDataActions.loadAssignPrioritiesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchAssignPriorities.mockReturnValue(response$);

        m.expect(effects.fetchAssignPriorities$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchBookingTypes$', () => {
    it(
      'should fetch the booking types from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadBookingTypes();
        const successAction = ReferenceDataActions.loadBookingTypesSuccess({
          bookingTypes: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchBookingTypes.mockReturnValue(response$);

        m.expect(effects.fetchBookingTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any further actions while fetching the booking types is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadBookingTypes();
        const successAction = ReferenceDataActions.loadBookingTypesSuccess({
          bookingTypes: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchBookingTypes.mockReturnValue(response$);

        m.expect(effects.fetchBookingTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the booking types are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadBookingTypesSuccess({
          bookingTypes: []
        });

        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchBookingTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the booking types fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadBookingTypes();
        const errorAction = ReferenceDataActions.loadBookingTypesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchBookingTypes.mockReturnValue(response$);

        m.expect(effects.fetchBookingTypes$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchClusters$', () => {
    it(
      'should fetch the clusters from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadClusters();
        const successAction = ReferenceDataActions.loadClustersSuccess({
          clusters: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchClusters.mockReturnValue(response$);

        m.expect(effects.fetchClusters$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any further actions while fetching the clusters is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadClusters();
        const successAction = ReferenceDataActions.loadClustersSuccess({
          clusters: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchClusters.mockReturnValue(response$);

        m.expect(effects.fetchClusters$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the clusters are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadClustersSuccess({
          clusters: []
        });

        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchClusters$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the clusters fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadClusters();
        const errorAction = ReferenceDataActions.loadClustersError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchClusters.mockReturnValue(response$);

        m.expect(effects.fetchClusters$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchCPSAreas$', () => {
    it(
      'should fetch the cps Areas from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSAreas();
        const successAction = ReferenceDataActions.loadCPSAreasSuccess({
          cpsAreas: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchCPSAreas.mockReturnValue(response$);

        m.expect(effects.fetchCPSAreas$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the cps Areas is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSAreas();
        const successAction = ReferenceDataActions.loadCPSAreasSuccess({
          cpsAreas: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchCPSAreas.mockReturnValue(response$);

        m.expect(effects.fetchCPSAreas$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the cps Areas are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSAreasSuccess({
          cpsAreas: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchCPSAreas$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the cps Areas fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadCPSAreas();
        const errorAction = ReferenceDataActions.loadCPSAreasError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchCPSAreas.mockReturnValue(response$);

        m.expect(effects.fetchCPSAreas$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchCPSBusinessUnits$', () => {
    it(
      'should fetch the cps business units from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSBusinessUnits();
        const successAction = ReferenceDataActions.loadCPSBusinessUnitsSuccess({
          cpsBusinessUnits: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchCPSBusinessUnits.mockReturnValue(response$);

        m.expect(effects.fetchCPSBusinessUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the cps business units is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSBusinessUnits();
        const successAction = ReferenceDataActions.loadCPSBusinessUnitsSuccess({
          cpsBusinessUnits: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchCPSBusinessUnits.mockReturnValue(response$);

        m.expect(effects.fetchCPSBusinessUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the cps business units are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSBusinessUnitsSuccess({
          cpsBusinessUnits: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchCPSBusinessUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the cps business units fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadCPSBusinessUnits();
        const errorAction = ReferenceDataActions.loadCPSBusinessUnitsError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchCPSBusinessUnits.mockReturnValue(response$);

        m.expect(effects.fetchCPSBusinessUnits$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchCPSCaseStatuses$', () => {
    it(
      'should fetch the cps case statuses from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSCaseStatuses();
        const successAction = ReferenceDataActions.loadCPSCaseStatusesSuccess({
          cpsCaseStatuses: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchCPSCaseStatuses.mockReturnValue(response$);

        m.expect(effects.fetchCPSCaseStatuses$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the cps case statuses is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSCaseStatuses();
        const successAction = ReferenceDataActions.loadCPSCaseStatusesSuccess({
          cpsCaseStatuses: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchCPSCaseStatuses.mockReturnValue(response$);

        m.expect(effects.fetchCPSCaseStatuses$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the cps case statuses are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadCPSCaseStatusesSuccess({
          cpsCaseStatuses: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchCPSCaseStatuses$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the cps case statuses fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadCPSCaseStatuses();
        const errorAction = ReferenceDataActions.loadCPSCaseStatusesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchCPSCaseStatuses.mockReturnValue(response$);

        m.expect(effects.fetchCPSCaseStatuses$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchFixedLists$', () => {
    it(
      'should fetch the fixed lists from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadFixedLists();
        const successAction = ReferenceDataActions.loadFixedListsSuccess({
          fixedLists: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchFixedLists.mockReturnValue(response$);

        m.expect(effects.fetchFixedLists$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any further actions while fetching the fixed lists is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadFixedLists();
        const successAction = ReferenceDataActions.loadFixedListsSuccess({
          fixedLists: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchFixedLists.mockReturnValue(response$);

        m.expect(effects.fetchFixedLists$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the fixed lists are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadFixedListsSuccess({
          fixedLists: [{ id: '*' } as FixedList]
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchFixedLists$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the fixed lists fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadFixedLists();
        const errorAction = ReferenceDataActions.loadFixedListsError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchFixedLists.mockReturnValue(response$);

        m.expect(effects.fetchFixedLists$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchHearingTypes$', () => {
    it(
      'should fetch the hearing types from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadHearingTypes();
        const successAction = ReferenceDataActions.loadHearingTypesSuccess({
          hearingTypes: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchHearingTypes.mockReturnValue(response$);

        m.expect(effects.fetchHearingTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the hearing types is in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadHearingTypes();
        const successAction = ReferenceDataActions.loadHearingTypesSuccess({
          hearingTypes: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchHearingTypes.mockReturnValue(response$);

        m.expect(effects.fetchHearingTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the hearing types are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadHearingTypesSuccess({
          hearingTypes: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchHearingTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the hearing types fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadHearingTypes();
        const errorAction = ReferenceDataActions.loadHearingTypesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchHearingTypes.mockReturnValue(response$);

        m.expect(effects.fetchHearingTypes$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchOrganisationUnits$', () => {
    it(
      'should fetch the court centres from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnits();
        const successAction = ReferenceDataActions.loadOrganisationUnitsSuccess({
          organisationUnits: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchOrganisationUnits.mockReturnValue(response$);

        m.expect(effects.fetchOrganisationUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the court centres is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnits();
        const successAction = ReferenceDataActions.loadOrganisationUnitsSuccess({
          organisationUnits: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchOrganisationUnits.mockReturnValue(response$);

        m.expect(effects.fetchOrganisationUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the court centres are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnitsSuccess({
          organisationUnits: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchOrganisationUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the court centres fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadOrganisationUnits();
        const errorAction = ReferenceDataActions.loadOrganisationUnitsError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchOrganisationUnits.mockReturnValue(response$);

        m.expect(effects.fetchOrganisationUnits$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchPoliceForceList$', () => {
    it(
      'should fetch the policeForceList from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPoliceForceList();
        const successAction = ReferenceDataActions.loadPoliceForceListSuccess({
          policeForceList: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchPoliceForceList.mockReturnValue(response$);

        m.expect(effects.fetchPoliceForceList$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the policeForceList is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPoliceForceList();
        const successAction = ReferenceDataActions.loadPoliceForceListSuccess({
          policeForceList: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchPoliceForceList.mockReturnValue(response$);

        m.expect(effects.fetchPoliceForceList$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the policeForceList are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPoliceForceListSuccess({
          policeForceList: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchPoliceForceList$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the policeForceList fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadPoliceForceList();
        const errorAction = ReferenceDataActions.loadPoliceForceListError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchPoliceForceList.mockReturnValue(response$);

        m.expect(effects.fetchPoliceForceList$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchProsecutors$', () => {
    it(
      'should fetch the prosecutors from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadProsecutors();
        const successAction = ReferenceDataActions.loadProsecutorsSuccess({
          prosecutors: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchProsecutors.mockReturnValue(response$);

        m.expect(effects.fetchProsecutors$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the prosecutors is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnits();

        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchProsecutors$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the prosecutors are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnitsSuccess({
          organisationUnits: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchProsecutors$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the prosecutors fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadProsecutors();
        const errorAction = ReferenceDataActions.loadProsecutorsError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchProsecutors.mockReturnValue(response$);

        m.expect(effects.fetchProsecutors$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchPleaTypes$', () => {
    it(
      'should fetch the plea types from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPleaTypes();
        const successAction = ReferenceDataActions.loadPleaTypesSuccess({
          pleaStatusTypes: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchPleaTypes.mockReturnValue(response$);

        m.expect(effects.fetchPleaTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the plea types is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnits();

        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchPleaTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the plea types are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationUnitsSuccess({
          organisationUnits: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchPleaTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the plea types fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadPleaTypes();
        const errorAction = ReferenceDataActions.loadPleaTypesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchPleaTypes.mockReturnValue(response$);

        m.expect(effects.fetchPleaTypes$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchWitnessCareUnits$', () => {
    it(
      'should fetch the witnessCareUnits from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadWitnessCareUnits();
        const successAction = ReferenceDataActions.loadWitnessCareUnitsSuccess({
          witnessCareUnits: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchWitnessCareUnits.mockReturnValue(response$);

        m.expect(effects.fetchWitnessCareUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the witnessCareUnits is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadWitnessCareUnits();
        const successAction = ReferenceDataActions.loadWitnessCareUnitsSuccess({
          witnessCareUnits: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchWitnessCareUnits.mockReturnValue(response$);

        m.expect(effects.fetchWitnessCareUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the witnessCareUnits are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadWitnessCareUnitsSuccess({
          witnessCareUnits: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchWitnessCareUnits$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the witnessCareUnits fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadWitnessCareUnits();
        const errorAction = ReferenceDataActions.loadWitnessCareUnitsError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchWitnessCareUnits.mockReturnValue(response$);

        m.expect(effects.fetchWitnessCareUnits$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchTrialTypes$', () => {
    it(
      'should fetch the trial types from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadTrialTypes();
        const successAction = ReferenceDataActions.loadTrialTypesSuccess({
          trialTypes: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchTrialTypes.mockReturnValue(response$);

        m.expect(effects.fetchTrialTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the trial types is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadTrialTypes();
        const successAction = ReferenceDataActions.loadTrialTypesSuccess({
          trialTypes: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchTrialTypes.mockReturnValue(response$);

        m.expect(effects.fetchTrialTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the trial types are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadTrialTypesSuccess({
          trialTypes: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchTrialTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the trial types fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadTrialTypes();
        const errorAction = ReferenceDataActions.loadTrialTypesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchTrialTypes.mockReturnValue(response$);

        m.expect(effects.fetchTrialTypes$).toBeObservable(expected$);
      })
    );
  });

  describe('fetchPoliceRanks$', () => {
    it(
      'should fetch the police ranks from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPoliceRanks();
        const successAction = ReferenceDataActions.loadPoliceRanksSuccess({
          policeRanks: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });
        fetchPoliceRanks.mockReturnValue(response$);

        m.expect(effects.fetchPoliceRanks$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the police ranks is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPoliceRanks();
        const successAction = ReferenceDataActions.loadPoliceRanksSuccess({
          policeRanks: []
        });
        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });
        fetchPoliceRanks.mockReturnValue(response$);

        m.expect(effects.fetchPoliceRanks$).toBeObservable(expected$);
      })
    );
    it(
      'should ignore any actions when the police ranks are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPoliceRanksSuccess({
          policeRanks: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');
        m.expect(effects.fetchPoliceRanks$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the police ranks fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadPoliceRanks();
        const errorAction = ReferenceDataActions.loadPoliceRanksError({ error });
        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });
        fetchPoliceRanks.mockReturnValue(response$);

        m.expect(effects.fetchPoliceRanks$).toBeObservable(expected$);
      })
    );
  });
  describe('fetchPublicHolidays$', () => {
    it(
      'should fetch the public holidays from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPublicHolidays();
        const successAction = ReferenceDataActions.loadPublicHolidaysSuccess({
          publicHolidays: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchPublicHolidays.mockReturnValue(response$);

        m.expect(effects.fetchPublicHolidays$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the public holidays is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPublicHolidays();
        const successAction = ReferenceDataActions.loadPublicHolidaysSuccess({
          publicHolidays: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchPublicHolidays.mockReturnValue(response$);

        m.expect(effects.fetchPublicHolidays$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the public holidays are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadPublicHolidaysSuccess({
          publicHolidays: []
        });
        store.dispatch(loadAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchPublicHolidays$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the public holidays fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadPublicHolidays();
        const errorAction = ReferenceDataActions.loadPublicHolidaysError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchPublicHolidays.mockReturnValue(response$);

        m.expect(effects.fetchPublicHolidays$).toBeObservable(expected$);
      })
    );
  });
  describe('fetchOrganisationsWithType$', () => {
    it(
      'should fetch the organisations with org type from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationsWithType({
          organisationType: OrganisationType.NPS
        });
        const successAction = ReferenceDataActions.loadOrganisationsWithTypeSuccess({
          organisationsWithType: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchOrganisationsWithType.mockReturnValue(response$);

        m.expect(effects.fetchOrganisationsWithType$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the organisations with org type is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationsWithType({
          organisationType: OrganisationType.NPS
        });
        const successAction = ReferenceDataActions.loadOrganisationsWithTypeSuccess({
          organisationsWithType: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchOrganisationsWithType.mockReturnValue(response$);

        m.expect(effects.fetchOrganisationsWithType$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when the organisations with org type are already in the store',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadOrganisationsWithType({
          organisationType: OrganisationType.NPS
        });
        const successAction = ReferenceDataActions.loadOrganisationsWithTypeSuccess({
          organisationsWithType: []
        });
        store.dispatch(successAction);

        actions$ = m.hot('        -a-', { a: loadAction });
        const expected$ = m.cold('---');

        m.expect(effects.fetchOrganisationsWithType$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the organisations with org tyoe fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadOrganisationsWithType({
          organisationType: OrganisationType.NPS
        });
        const errorAction = ReferenceDataActions.loadOrganisationsWithTypeError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchOrganisationsWithType.mockReturnValue(response$);

        m.expect(effects.fetchOrganisationsWithType$).toBeObservable(expected$);
      })
    );
  });
  describe('fetchRotaBusinessTypes$', () => {
    it(
      'should fetch the Rota business types from the server',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadRotaBusinessTypes();
        const successAction = ReferenceDataActions.loadRotaBusinessTypesSuccess({
          rotaBusinessTypes: []
        });

        actions$ = m.hot('        -a----', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchRotaBusinessTypes.mockReturnValue(response$);

        m.expect(effects.fetchRotaBusinessTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should ignore any actions when fetching the Rota business types is already in progress',
      marbles((m) => {
        const loadAction = ReferenceDataActions.loadRotaBusinessTypes();
        const successAction = ReferenceDataActions.loadRotaBusinessTypesSuccess({
          rotaBusinessTypes: []
        });

        actions$ = m.hot('        -aa---', { a: loadAction });
        const response$ = m.cold(' -(b|)', { b: [] });
        const expected$ = m.cold('--c---', { c: successAction });

        fetchRotaBusinessTypes.mockReturnValue(response$);

        m.expect(effects.fetchRotaBusinessTypes$).toBeObservable(expected$);
      })
    );

    it(
      'should handle an error when fetching the Rota business types fails',
      marbles((m) => {
        const error = new HttpErrorResponse({ status: 500 });
        const loadAction = ReferenceDataActions.loadRotaBusinessTypes();
        const errorAction = ReferenceDataActions.loadRotaBusinessTypesError({ error });

        actions$ = m.hot('        -a-', { a: loadAction });
        const response$ = m.cold(' -#', undefined, error);
        const expected$ = m.cold('--b', { b: errorAction });

        fetchRotaBusinessTypes.mockReturnValue(response$);

        m.expect(effects.fetchRotaBusinessTypes$).toBeObservable(expected$);
      })
    );
  });
});
