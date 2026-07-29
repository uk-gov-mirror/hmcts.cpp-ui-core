import { sortSelectOptionAlphabetical } from '../sort-select-options-Alphabetical';

describe('sortAlphabetical', () => {
  it('should sort options alphabetically by label', () => {
    const input = [
      { value: '2', label: 'Bexley Mags Court' },
      { value: '1', label: 'Acton Mags Court' },
      { value: '3', label: 'Cambridge Mags Court' }
    ];

    const sorted = [...input].sort(sortSelectOptionAlphabetical);

    expect(sorted).toEqual([
      { value: '1', label: 'Acton Mags Court' },
      { value: '2', label: 'Bexley Mags Court' },
      { value: '3', label: 'Cambridge Mags Court' }
    ]);
  });

  it('should return 0 for equal labels', () => {
    const result = sortSelectOptionAlphabetical(
      { value: '1', label: 'Same' },
      { value: '2', label: 'same' }
    );
    expect(result).toBe(0);
  });
});
