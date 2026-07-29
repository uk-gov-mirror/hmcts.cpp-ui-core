import { ProviderToken, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

/**
 * A utility function to lazily convert class guards to functional guards.
 * simply wrap guards in routing module with this function to cast as functional guards.
 * Functional guards are preferred to Class Guards from NG 15
 * @param guards - an array of guards
 * @returns @type CanActivateFn[]
 */
export function functionalGuardsFactory(
  ...guards: ProviderToken<{ canActivate: CanActivateFn }>[]
): CanActivateFn[] {
  return guards.map(
    (guard) =>
      (...args: Parameters<CanActivateFn>) =>
        inject(guard).canActivate(...args)
  );
}
