import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ApplicationTypeAutosuggestComponent } from './components/application-type.autosuggest';
import { AssignPrioritySelectComponent } from './components/assign-priority.select';
import { BookingTypesSelectComponent } from './components/booking-type.select';
import { ClusterAutosuggestComponent } from './components/cluster.autosuggest';
import { CPSAreaSelectComponent } from './components/cps-area.select';
import { CPSBusinessUnitSelectComponent } from './components/cps-business-unit.select';
import { CPSCaseStatusSelectComponent } from './components/cps-case-status.select';
import { FixedListAutosuggestComponent } from './components/fixed-list.autosuggest';
import { HearingTypeAutosuggestComponent } from './components/hearing-type.autosuggest';
import { HearingTypeSelectComponent } from './components/hearing-type.select';
import { OrganisationUnitAutosuggestComponent } from './components/organisation-unit.autosuggest';
import { PoliceForceAutosuggestComponent } from './components/police-force.autosuggest';
import { ProsecutorAutosuggestComponent } from './components/prosecutor.autosuggest';
import { WitnessCareUnitSelectComponent } from './components/witness-care-unit.select';
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
import { JudicialMemberNamePipe } from './utils/judicial-member-name.pipe';
import { SpecialRequirementCheckboxComponent } from './components/special-requirements.checkbox';
import {
  ApplicationTypeStandaloneAutosuggestComponent,
  PoliceRanksGuard,
  PoliceRanksSelectComponent
} from './public_api';
import { PublicHolidaysGuard } from './guards/public-holidays.guard';
import { OrganisationWithTypeAutosuggestComponent } from './components/organisation-with-type.autosuggest';
import { RotaBusinessTypeSelectComponent } from './components/rota-business-types.select';

const COMPONENTS = [
  ApplicationTypeAutosuggestComponent,
  ApplicationTypeStandaloneAutosuggestComponent,
  AssignPrioritySelectComponent,
  BookingTypesSelectComponent,
  ClusterAutosuggestComponent,
  CPSAreaSelectComponent,
  CPSBusinessUnitSelectComponent,
  CPSCaseStatusSelectComponent,
  OrganisationUnitAutosuggestComponent,
  FixedListAutosuggestComponent,
  HearingTypeAutosuggestComponent,
  HearingTypeSelectComponent,
  PoliceForceAutosuggestComponent,
  PoliceRanksSelectComponent,
  ProsecutorAutosuggestComponent,
  WitnessCareUnitSelectComponent,
  SpecialRequirementCheckboxComponent,
  JudicialMemberNamePipe,
  OrganisationWithTypeAutosuggestComponent,
  RotaBusinessTypeSelectComponent
];

/**
 * @deprecated
 * This will be removed in some release moving forward but is
 * left here for Backward compatilibity.
 *
 * To use reference data, remove the module where used.
 * In the app module or Bootstrap function (Standalone) or Route ,
 * provide refencedata context using the following as per preference
 *  @method provideReferenceDataEnvironmentContext
 * - This will provide all guards, and services  inclusive of the feature store.
 *  @method provideReferenceDataStore
 * - You can provide just the feature store using this method in your module or route providers and import the guards you need on demand.
 *
 *
 * PLEASE ENSURE THAT YOUR BOOTSTRAP OR APPMODULE USES THE PROVIDESTORE as the root prior to using any of the methods above mentioned. You can
 * mix StoreModule.forRoot and provideStore if the application is still modular - Please refer to Ngrx docs for details
 *
 * Finally all reference data components are standalone and can be imported on demand in the modules or standalone components
 * when needed.
 */
@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ReferenceDataEffects]),
    StoreModule.forFeature('referenceData', referenceDataReducer),
    ...COMPONENTS
  ],
  providers: [
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
    ReferenceDataService,
    RotaBusinessTypesGuard,
    SpecialRequirementsGuard,
    WitnessCareUnitGuard,
    TrialTypesGuard,
    PublicHolidaysGuard
  ],
  exports: [...COMPONENTS]
})
export class ReferenceDataModule {}
