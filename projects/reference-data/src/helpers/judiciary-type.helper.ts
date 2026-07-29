/**
 * Following enum used to assign judiciaries by its types.
 */
export enum JudiciaryTypesGroups {
  CIRCUIT_JUDGE = 'CIRCUIT_JUDGE',
  DISTRICT_JUDGE = 'DISTRICT_JUDGE',
  DEPUTY_DISTRICT_JUDGE = 'DEPUTY_DISTRICT_JUDGE',
  RECORDER = 'RECORDER',
  MAGISTRATE = 'MAGISTRATE'
}

/**
 * Types of JudiciaryTypesGroups enum as
 */
export type JudiciaryTypeGroup = keyof typeof JudiciaryTypesGroups;

/**
 * Following type is to represent values of [judiciaryType] property on reference data fetch judiciaries endpoint
 */
export type JudiciaryTypePayload =
  | ''
  | 'Judge'
  | 'District Judge'
  | 'Deputy District Judge'
  | 'Recorder'
  | 'Magistrate';

/**
 * Following type is represent all judiciary types on reference data
 */
export type RefDataJudiciaryType =
  | 'Magistrate'
  | 'Assistant Judge Advocate General'
  | 'Deputy Circuit Judge'
  | 'Judge Advocate General'
  | 'Recorder'
  | 'Circuit Judge'
  | 'Circuit Judge, Central Criminal Court'
  | 'Common Serjeant'
  | 'Court of Appeal Judge'
  | 'Court of Appeal Judge- Sitting in Retirement'
  | 'Deputy High Court Judge'
  | 'High Court Judge'
  | 'High Court Judge- Sitting in Retirement'
  | 'Lord Chief Justice'
  | 'President of the Queen’s Bench Division'
  | 'Recorder of London'
  | 'Senior Circuit Judge'
  | 'Specialist Circuit Judge'
  | 'Senior Presiding Judge'
  | 'Vice President of the QBD'
  | 'Deputy Senior District Judge (Chief Magistrate)'
  | 'District Judge (MC)'
  | 'Senior District Judge (Chief Magistrate)'
  | 'Deputy District Judge (MC)- Fee paid'
  | 'Deputy District Judge (MC)- Sitting in Retirement'
  | 'Deputy District Judge (MC) (Sitting in Retirement)'
  | 'District Judge (MC) (sitting in retirement)'
  | 'High Court Judge (also known as Puisne Judges)'
  | 'Deputy District Judge (MC)'
  | 'District Judge (MC) (sitting in retirement).'
  | 'High Court Judge (sitting in retirement)'
  | 'Lady Justice of Appeal'
  | 'Lady Justice of Appeal (sitting in retirement)'
  | 'Registrar of Criminal Appeals'
  | 'President of the Queen’s Bench'
  | 'Circuit Judge (sitting in retirement)'
  | 'Lord Justice of Appeal'
  | 'Lord Justice of Appeal (sitting in retirement)'
  | 'President of the King’s Bench Division'
  | 'Court of Appeal Judge (sitting in retirement)'
  | 'Lady Chief Justice'
  | 'Assistant Recorder'
  | 'Assistant Judge Advocate General (SiR)'
  | 'Deputy Judge Advocate General'
  | 'Assistant Judge Advocate General (sitting In retirement)'
  | 'Recorder (sitting in retirement)'
  | 'Vice Judge Advocate General';

/**
 * Gets the judiciary type group and converts it to understandable way of ref data service payload
 * @param judiciaryTypeGroup group name to be converted
 * @returns converted understandable endpoint string
 */
export const judiciaryTypeGroupToJudiciaryTypePayload = (
  judiciaryTypeGroup: JudiciaryTypeGroup
): JudiciaryTypePayload => {
  if (!judiciaryTypeGroup) {
    return '';
  }

  const judiciaryGroupMap: { [key in JudiciaryTypesGroups]: JudiciaryTypePayload } = {
    CIRCUIT_JUDGE: 'Judge',
    DISTRICT_JUDGE: 'District Judge',
    DEPUTY_DISTRICT_JUDGE: 'Deputy District Judge',
    RECORDER: 'Recorder',
    MAGISTRATE: 'Magistrate'
  };

  return judiciaryGroupMap[judiciaryTypeGroup] || '';
};

/**
 * Gets the reference data judiciary type and converts it to judiciary type group
 * @param refDataJudiciaryType ref data judiciary type
 * @returns judiciaryTypeGroup where ref data judiciary type belongs to
 */
export const mapRefDataJudiciaryToJudiciaryType = (
  refDataJudiciaryType: RefDataJudiciaryType
): JudiciaryTypeGroup | null => {
  const judiciaryMapping: { names: RefDataJudiciaryType[]; value: JudiciaryTypeGroup }[] = [
    {
      names: ['Magistrate'],
      value: 'MAGISTRATE'
    },
    {
      names: [
        'Assistant Judge Advocate General',
        'Deputy Circuit Judge',
        'Judge Advocate General',
        'Recorder',
        'Assistant Recorder',
        'Assistant Judge Advocate General (SiR)',
        'Deputy Judge Advocate General',
        'Assistant Judge Advocate General (sitting In retirement)',
        'Recorder (sitting in retirement)',
        'Vice Judge Advocate General'
      ],
      value: 'RECORDER'
    },
    {
      names: [
        'Circuit Judge',
        'Circuit Judge, Central Criminal Court',
        'Common Serjeant',
        'Court of Appeal Judge',
        'Court of Appeal Judge- Sitting in Retirement',
        'Deputy High Court Judge',
        'High Court Judge',
        'High Court Judge- Sitting in Retirement',
        'Lord Chief Justice',
        'President of the Queen’s Bench Division',
        'Recorder of London',
        'Senior Circuit Judge',
        'Specialist Circuit Judge',
        'Senior Presiding Judge',
        'Vice President of the QBD',
        'High Court Judge (also known as Puisne Judges)',
        'High Court Judge (sitting in retirement)',
        'Lady Justice of Appeal',
        'Lady Justice of Appeal (sitting in retirement)',
        'Registrar of Criminal Appeals',
        'President of the Queen’s Bench',
        'Circuit Judge (sitting in retirement)',
        'Lord Justice of Appeal',
        'Lord Justice of Appeal (sitting in retirement)',
        'President of the King’s Bench Division',
        'Court of Appeal Judge (sitting in retirement)',
        'Lady Chief Justice'
      ],
      value: 'CIRCUIT_JUDGE'
    },
    {
      names: [
        'Deputy Senior District Judge (Chief Magistrate)',
        'District Judge (MC)',
        'Senior District Judge (Chief Magistrate)',
        'District Judge (MC) (sitting in retirement)',
        'District Judge (MC) (sitting in retirement).'
      ],
      value: 'DISTRICT_JUDGE'
    },
    {
      names: [
        'Deputy District Judge (MC)',
        'Deputy District Judge (MC)- Fee paid',
        'Deputy District Judge (MC)- Sitting in Retirement',
        'Deputy District Judge (MC) (Sitting in Retirement)'
      ],
      value: 'DEPUTY_DISTRICT_JUDGE'
    }
  ];

  const judiciary = judiciaryMapping.find((mapping) =>
    mapping.names.includes(refDataJudiciaryType)
  );

  if (!judiciary) {
    return null;
  }

  return judiciary.value;
};
