import { JudicialMemberNamePipe } from '../judicial-member-name.pipe';

describe('JudiciaryFullNamePipe', () => {
  const pipe = new JudicialMemberNamePipe();

  it('should display all the prefixes and sufixes for the judiciary', () => {
    expect(
      pipe.transform({
        titlePrefix: 'Mr.',
        titleJudicialPrefix: 'HHJ',
        titleSuffix: 'QC',
        emailAddress: 'test@email',
        id: '19ffac44-3533-410d-868e-81cf825844b6',
        seqId: 1,
        forenames: 'John',
        surname: 'Smith',
        judiciaryType: 'Circuit Judge'
      })
    ).toEqual('Mr. HHJ SMITH QC');
  });

  it('should display requestedName for DDJ and Recorders', () => {
    expect(
      pipe.transform({
        titlePrefix: 'Mr.',
        titleJudicialPrefix: 'HHJ',
        titleSuffix: '',
        requestedName: 'DDJ John Smith QC',
        emailAddress: 'test@email',
        id: '19ffac44-3533-410d-868e-81cf825844b6',
        seqId: 1,
        forenames: 'John',
        surname: 'Smith',
        judiciaryType: 'Deputy District Judge (MC)- Fee paid'
      })
    ).toEqual('DDJ John Smith QC');

    expect(
      pipe.transform({
        titlePrefix: 'Mr.',
        titleJudicialPrefix: 'HHJ',
        titleSuffix: '',
        emailAddress: 'test@email',
        requestedName: 'RECORDER John Smith QC',
        id: '19ffac44-3533-410d-868e-81cf825844b6',
        seqId: 1,
        forenames: 'John',
        surname: 'Smith',
        judiciaryType: 'Recorder'
      })
    ).toEqual('RECORDER John Smith QC');
  });
});
