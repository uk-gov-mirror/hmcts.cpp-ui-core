import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ReferenceDataEffects } from './effects/reference-data.effects';
import { ApplicationTypesGuard } from './guards/application-type.guard';
import { AssignPrioritiesGuard } from './guards/assingn-priorities.guard';
import { BookingTypesGuard } from './guards/booking-types.guard';
import { ClustersGuard } from './guards/clusters.guard';
import { CPSAreasGuard } from './guards/cps-areas.guard';
import { CPSBusinessUnitsGuard } from './guards/cps-business-units.guard';
import { CPSCaseStatusGuard } from './guards/cps-case-status.guard';
import { FixedListsGuard } from './guards/fixed-lists.guard';
import { HearingTypesGuard } from './guards/hearing-type.guard';
import { JudiciaryGroupTypesGuard } from './guards/judiciary-group-types.guard';
import { LocalJusticeAreasGuard } from './guards/local-justice-areas.guard';
import { OrganisationUnitsGuard } from './guards/court-centres.guard';
import { PleaTypesGuard } from './guards/plea-types.guard';
import { PoliceForceListGuard } from './guards/police-force.guard';
import { ProsecutorsGuard } from './guards/prosecutors.guard';
import { RotaBusinessTypesGuard } from './guards/rota-business-types.guard';
import { SpecialRequirementsGuard } from './guards/special-requirement.guard';
import { WitnessCareUnitGuard } from './guards/witness-care-unit.guard';
import { referenceDataReducer } from './reducers/index';
import { ReferenceDataService } from './services/reference-data.service';
import { TrialTypesGuard } from './guards/trial-types.guard';
import { PoliceRanksGuard } from './public_api';
import { PublicHolidaysGuard } from './guards/public-holidays.guard';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const provideReferenceDataStore = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideState({ name: 'referenceData', reducer: referenceDataReducer }),
    provideEffects(ReferenceDataEffects)
  ]);
};

export const provideReferenceDataEnvironmentContext = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    ReferenceDataService,
    ApplicationTypesGuard,
    AssignPrioritiesGuard,
    BookingTypesGuard,
    ClustersGuard,
    CPSAreasGuard,
    CPSBusinessUnitsGuard,
    CPSCaseStatusGuard,
    OrganisationUnitsGuard,
    FixedListsGuard,
    HearingTypesGuard,
    JudiciaryGroupTypesGuard,
    LocalJusticeAreasGuard,
    PleaTypesGuard,
    PoliceForceListGuard,
    PoliceRanksGuard,
    ProsecutorsGuard,
    RotaBusinessTypesGuard,
    SpecialRequirementsGuard,
    WitnessCareUnitGuard,
    TrialTypesGuard,
    PublicHolidaysGuard,
    provideReferenceDataStore()
  ]);
};
