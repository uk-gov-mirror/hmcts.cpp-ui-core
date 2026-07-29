import {
  BreachType,
  CourtApplicationType,
  LinkType,
  OffenceActiveOrderType,
  SummonsTemplateType
} from '../reference-data.interfaces';

export const applicationTypeMockOne: CourtApplicationType = {
  id: '00380a1d-65a8-4dc1-bf08-b1421f51d30e',
  code: 'CODE01',
  type: 'Application Type 1',
  categoryCode: '*',
  linkType: LinkType.STANDALONE,
  jurisdiction: '*',
  hearingCode: 'APN',
  appealFlag: false,
  applicantAppellantFlag: false,
  breachType: BreachType.NOT_APPLICABLE,
  commrOfOathFlag: false,
  courtExtractAvlFlag: false,
  courtOfAppealFlag: false,
  offenceActiveOrder: OffenceActiveOrderType.NOT_APPLICABLE,
  pleaApplicableFlag: false,
  prosecutorThirdPartyFlag: false,
  summonsTemplateType: SummonsTemplateType.NOT_APPLICABLE,
  spiOutApplicableFlag: false,
  resentencingActivationCode: 'ACTCODEX',
  prefix: 'prefix'
};

export const applicationTypeMockTwo: CourtApplicationType = {
  id: '003806bd-bdc8-4908-ac63-bb7575f6a196',
  code: 'CODE02',
  type: 'Application Type 2',
  categoryCode: '*',
  linkType: LinkType.STANDALONE,
  jurisdiction: '*',
  hearingCode: 'REV',
  appealFlag: false,
  applicantAppellantFlag: false,
  breachType: BreachType.NOT_APPLICABLE,
  commrOfOathFlag: false,
  courtExtractAvlFlag: false,
  courtOfAppealFlag: false,
  offenceActiveOrder: OffenceActiveOrderType.NOT_APPLICABLE,
  pleaApplicableFlag: false,
  prosecutorThirdPartyFlag: false,
  summonsTemplateType: SummonsTemplateType.NOT_APPLICABLE,
  spiOutApplicableFlag: false,
  resentencingActivationCode: 'ACTCODEY',
  prefix: 'prefix2'
};
