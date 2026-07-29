import { mapApplicationType } from '../mapper';
import {
  Offence,
  CourtApplicationType,
  LinkType,
  SummonsTemplateType,
  OffenceActiveOrderType,
  BreachType
} from '../../reference-data.interfaces';

describe('mapApplicationType', () => {
  it('should return an empty array when no offences are provided', () => {
    const result = mapApplicationType([]);
    expect(result).toEqual([]);
  });

  it('should map offences to CourtApplicationType correctly', () => {
    const offences: Offence[] = [
      {
        offenceId: '1',
        title: 'Offence Title',
        offenceType: 'Category Code',
        cjsOffenceCode: 'CJS123',
        legislation: 'Legislation',
        startDate: '2023-01-01',
        pssOffenceId: 'PSS123',
        offenceWording: 'Offence Wording',
        titleWelsh: 'Title Welsh',
        changeDate: '2023-01-02'
      } as Offence
    ];

    const expected: CourtApplicationType[] = [
      {
        id: '1',
        type: 'Offence Title',
        typeWelsh: 'Title Welsh',
        categoryCode: 'Category Code',
        jurisdiction: 'MAGISTRATES',
        linkType: LinkType.STANDALONE,
        code: 'CJS123',
        legislation: 'Legislation',
        validFrom: '2023-01-01T00:00:00.000Z',
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
        prosecutorThirdPartyFlag: false,
        spiOutApplicableFlag: true,
        pssId: 'PSS123',
        applicationWording: 'Offence Wording',
        initialFeeApplicable: false,
        contestedFeeApplicable: false,
        exParte: false,
        sowRef: 'APPS',
        changeDate: '2023-01-02T00:00:00.000Z',
        lastModified: '2023-01-02T00:00:00.000Z',
        resentencingActivationCode: '',
        prefix: ''
      }
    ];

    const result = mapApplicationType(offences);
    expect(result).toEqual(expected);
  });

  it('should handle offences with missing optional fields', () => {
    const offences: Offence[] = [
      {
        offenceId: '2',
        title: 'Another Offence',
        offenceType: 'Another Category',
        cjsOffenceCode: undefined,
        legislation: undefined,
        startDate: undefined,
        pssOffenceId: undefined,
        offenceWording: undefined,
        changeDate: undefined
      } as any
    ];

    const result = mapApplicationType(offences);
    expect(result[0].code).toBeUndefined();
    expect(result[0].legislation).toBeUndefined();
    expect(result[0].validFrom).toEqual('');
    expect(result[0].pssId).toBeUndefined();
    expect(result[0].applicationWording).toBeUndefined();
    expect(result[0].changeDate).toEqual('');
  });
});
