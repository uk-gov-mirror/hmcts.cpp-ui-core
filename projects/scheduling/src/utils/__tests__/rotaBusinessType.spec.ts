import { getRotaBusinessTypeOptions, isRotaBusinessTypeDurationBased } from '../rotaBusinessType';

describe('getRotaBusinessTypeOptions', () => {
  it('should map and sort rota business types', () => {
    const input = [
      { typeCode: 'TRL', typeDescription: 'Trial' },
      { typeCode: 'BL', typeDescription: 'Bail' }
    ] as any;

    const result = getRotaBusinessTypeOptions(input);
    expect(result).toEqual([
      { value: 'BL', label: 'Bail' },
      { value: 'TRL', label: 'Trial' }
    ]);
  });
});

describe('isRotaBusinessTypeDurationBased', () => {
  it('should return true if the business type has duration', () => {
    const input = [{ typeCode: 'X', duration: true }] as any;
    expect(isRotaBusinessTypeDurationBased('X', input)).toBe(true);
  });

  it('should return false if the business type has no duration', () => {
    const input = [{ typeCode: 'X', duration: false }] as any;
    expect(isRotaBusinessTypeDurationBased('X', input)).toBe(false);
  });

  it('should return false if the business type is not found', () => {
    const input = [{ typeCode: 'A', duration: true }] as any;
    expect(isRotaBusinessTypeDurationBased('Z', input)).toBe(false);
  });
});
