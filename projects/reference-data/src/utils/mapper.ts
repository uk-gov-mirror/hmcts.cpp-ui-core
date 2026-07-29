import {
  BreachType,
  CourtApplicationType,
  LinkType,
  Offence,
  OffenceActiveOrderType,
  SummonsTemplateType
} from '../reference-data.interfaces';

const formatDate = (dateStr: string): string => {
  if (!dateStr) {
    return '';
  }

  let normalized = dateStr.trim();

  // If it's just a date (YYYY-MM-DD), add time
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    normalized += 'T00:00:00';
  }

  // Add Z if not present
  if (!/[Z+-]\d{0,2}:\d{0,2}$/.test(normalized)) {
    normalized += 'Z';
  }

  return new Date(normalized).toISOString();
};

export const mapApplicationType = (offences: Offence[] = []): CourtApplicationType[] =>
  offences.map(
    (offence) =>
      ({
        id: offence.offenceId,
        type: offence.title,
        categoryCode: offence.offenceType,
        jurisdiction: 'MAGISTRATES',
        linkType: LinkType.STANDALONE,
        code: offence.cjsOffenceCode,
        legislation: offence.legislation,
        validFrom: formatDate(offence.startDate),
        appealFlag: false,
        summonsTemplateType: SummonsTemplateType.NOT_APPLICABLE,
        hearingCode: 'APL',
        applicantAppellantFlag: false,
        pleaApplicableFlag: false,
        offenceActiveOrder: OffenceActiveOrderType.NOT_APPLICABLE,
        commrOfOathFlag: false,
        breachType: BreachType.NOT_APPLICABLE,
        courtOfAppealFlag: false,
        courtExtractAvlFlag: true,
        listingNotifTemplate: 'POSTAL_NOTIFICATION',
        boxworkNotifTemplate: 'NOT_APPLICABLE',
        typeWelsh: offence.titleWelsh,
        prosecutorThirdPartyFlag: false,
        spiOutApplicableFlag: true,
        pssId: offence.pssOffenceId,
        applicationWording: offence.offenceWording,
        initialFeeApplicable: false,
        contestedFeeApplicable: false,
        exParte: false,
        sowRef: 'APPS',
        changeDate: formatDate(offence.changeDate),
        lastModified: formatDate(offence.changeDate),
        resentencingActivationCode: '',
        prefix: ''
      } as CourtApplicationType)
  );
