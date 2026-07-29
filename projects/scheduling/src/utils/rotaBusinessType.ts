import { SelectOption } from '@cpp/pdk';
import { RotaBusinessType, sortSelectOptionAlphabetical } from '@cpp/reference-data';

export const getRotaBusinessTypeOptions = (
  rotaBusinessTypes: RotaBusinessType[]
): SelectOption<string>[] =>
  rotaBusinessTypes
    .map((rotaBusinessType) => ({
      value: rotaBusinessType.typeCode,
      label: rotaBusinessType.typeDescription
    }))
    .sort(sortSelectOptionAlphabetical);

export const isRotaBusinessTypeDurationBased = (
  rotaBusinessTypeCode: string,
  initialRotaBusinessTypes: RotaBusinessType[]
): boolean => {
  const rotaBusinessType = initialRotaBusinessTypes.find(
    (type) => type.typeCode === rotaBusinessTypeCode
  );
  return rotaBusinessType ? rotaBusinessType.duration : false;
};
