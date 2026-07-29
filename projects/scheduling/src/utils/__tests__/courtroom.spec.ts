import { getCourtroomOptions } from '../courtrooms';

describe('getCourtroomOptions', () => {
  it('should return mapped courtroom options if courtrooms exist', () => {
    const organisationUnit: any = {
      courtrooms: [
        { id: '1', courtroomName: 'Court A' },
        { id: '2', courtroomName: 'Court B' }
      ]
    };

    const result = getCourtroomOptions(organisationUnit);
    expect(result).toEqual([
      { value: '1', label: 'Court A' },
      { value: '2', label: 'Court B' }
    ]);
  });

  it('should return an empty array if no courtrooms exist', () => {
    const organisationUnit: any = {};
    expect(getCourtroomOptions(organisationUnit)).toEqual([]);
  });

  it('should return an empty array if no organisation unit is provided', () => {
    expect(getCourtroomOptions(undefined)).toEqual([]);
  });
});
