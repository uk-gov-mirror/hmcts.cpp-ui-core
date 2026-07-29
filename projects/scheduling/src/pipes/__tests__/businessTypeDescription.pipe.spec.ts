import { RotaBusinessType, RotaBusinessTypeCode } from '@cpp/reference-data';
import { BusinessTypeDescriptionPipe } from '../businessTypeDescription.pipe';

describe('BusinessTypeDescriptionPipe', () => {
  let pipe: BusinessTypeDescriptionPipe;

  const rotaBusinessTypesByCode: Record<string, RotaBusinessType> = {
    TRL: { typeCode: 'TRL', typeDescription: 'Trial' } as unknown as RotaBusinessType
  };

  beforeEach(() => {
    pipe = new BusinessTypeDescriptionPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct description for a valid type code', () => {
    expect(pipe.transform('TRL', rotaBusinessTypesByCode)).toBe('Trial');
  });

  it('should return an empty string for an unknown type code', () => {
    expect(pipe.transform('XYZ' as string, rotaBusinessTypesByCode)).toBe('');
  });

  it('should return an empty string when rotaBusinessTypesByCode is empty', () => {
    expect(pipe.transform('TRL', {} as Record<string, RotaBusinessType>)).toBe('');
  });
});
