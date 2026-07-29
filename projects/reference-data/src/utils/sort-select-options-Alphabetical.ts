import { SelectOption } from '@cpp/pdk';

/**
 * A comparator function to sort an array of select options alphabetically.
 * This function expects objects that extend the SelectOption interface with a string label.
 * It converts the label values to uppercase to ensure a case-insensitive comparison.
 *
 * @param a - The first select option to compare.
 * @param b - The second select option to compare.
 * @returns A negative number if `a.label` comes before `b.label`, a positive number if `a.label` comes after `b.label`, or 0 if they are equal.
 */
export const sortSelectOptionAlphabetical = <T extends SelectOption<string>>(
  a: T,
  b: T
): number => {
  const aText = a.label.toUpperCase();
  const bText = b.label.toUpperCase();

  return aText < bText ? -1 : aText > bText ? 1 : 0;
};
