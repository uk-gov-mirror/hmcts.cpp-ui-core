import { SelectOption } from '@cpp/pdk';
import { OrganisationUnit } from '@cpp/reference-data';

export const getCourtroomOptions = (
  organisationUnit?: OrganisationUnit
): SelectOption<string>[] => {
  if (organisationUnit && organisationUnit.courtrooms) {
    return organisationUnit.courtrooms.map((courtroom) => ({
      value: courtroom.id,
      label: courtroom.courtroomName
    }));
  }
  return [];
};
