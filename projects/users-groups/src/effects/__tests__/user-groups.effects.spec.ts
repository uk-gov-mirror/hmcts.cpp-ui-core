import { Observable } from 'rxjs';
import { UserGroupsEffects } from '../user-groups.effects';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { UsersGroupsService } from '../../services/users-groups.service';
import { userGroupsReducer } from '../../reducers/users-groups.reducer';
import { marbles } from 'rxjs-marbles/marbles';
import { UsersGroupsActions } from '../../actions';
import { take, tap } from 'rxjs/operators';
import { UserServiceFeature } from '../../users-groups.interfaces';

describe('UserGroupsEffects', () => {
  let actions$: Observable<any>;
  let effects: UserGroupsEffects;
  let service: UsersGroupsService;
  let fetchUserFeatures: jest.Mock;

  beforeEach(() => {
    fetchUserFeatures = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            referenceData: userGroupsReducer
          },
          {
            runtimeChecks: {}
          }
        )
      ],
      providers: [
        UserGroupsEffects,
        {
          provide: UsersGroupsService,
          useValue: {
            fetchUserFeatures
          }
        },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(UserGroupsEffects);
    service = TestBed.inject(UsersGroupsService);
  });

  const createFeaturesSuccessAction = (userFeatures: UserServiceFeature[]) =>
    UsersGroupsActions.setUserFeaturesSuccess({
      userFeatures
    });
  describe('startFeaturesPolling$', () => {
    it('should fetch the user features from the server', fakeAsync(
      marbles((m) => {
        const setFeaturesAction = UsersGroupsActions.setUserFeatures({});

        actions$ = m.cold('       -(a|)----', { a: setFeaturesAction });
        const response$ = m.cold('--(b|)---', { b: [{ key: 'feature1' }] });
        const expected$ = m.cold('---(c|)---', {
          c: createFeaturesSuccessAction([{ key: 'feature1' }] as UserServiceFeature[])
        });

        fetchUserFeatures.mockReturnValueOnce(response$);

        m.expect(effects.startFeaturesPolling$.pipe(take(1))).toBeObservable(expected$);
      })
    ));

    it('should fetch the user features from the server for the second time after polling interval', fakeAsync(
      marbles((m) => {
        const setFeaturesAction = UsersGroupsActions.setUserFeatures({ pollingInterval: 1500 });

        actions$ = m.cold('        -(a|)----', { a: setFeaturesAction });
        const response$ = m.cold(' --(b|)---', { b: [{ key: 'feature1' }] });
        const response2$ = m.cold('--(c|)---', { c: [{ key: 'feature1' }, { key: 'feature2' }] });
        const expected$ = m.cold(' ---(d|)---', {
          d: createFeaturesSuccessAction([{ key: 'feature1' }] as UserServiceFeature[])
        });
        const expected2$ = m.cold('---(e|)---', {
          e: createFeaturesSuccessAction([
            { key: 'feature1' },
            { key: 'feature2' }
          ] as UserServiceFeature[])
        });

        fetchUserFeatures.mockReturnValueOnce(response$);
        m.expect(effects.startFeaturesPolling$.pipe(take(1))).toBeObservable(expected$);

        fetchUserFeatures.mockReturnValueOnce(response2$);

        tick(1550);
        m.expect(
          effects.startFeaturesPolling$.pipe(
            tap(() => {
              expect(fetchUserFeatures).toHaveBeenCalledTimes(2);
            }),
            take(1)
          )
        ).toBeObservable(expected2$);
      })
    ));
  });
});
