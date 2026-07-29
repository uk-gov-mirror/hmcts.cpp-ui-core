import { of, throwError } from 'rxjs';
import { concat, delay, map, retryWhen, switchMap, take } from 'rxjs/operators';

export function pollUntil<T>(
  fn: () => Promise<T>,
  conditionFn?: (result: T) => boolean
): Promise<T> {
  const hasCriteria = conditionFn || (result => Boolean(result));

  return new Promise<T>((resolve, reject) => {
    of(null)
      .pipe(
        switchMap(fn),
        map(result => {
          if (hasCriteria(result)) {
            return result;
          }
          throw new Error('Criteria did not match');
        }),
        retryWhen(errors$ =>
          errors$.pipe(
            delay(1000),
            take(24),
            concat(throwError('Polling expired after 25 seconds.'))
          )
        )
      )
      .subscribe(resolve, reject);
  });
}

export function pollUntilExists<T>(fn: () => Promise<T>): Promise<T> {
  return pollUntil(fn, value => Boolean(value));
}
