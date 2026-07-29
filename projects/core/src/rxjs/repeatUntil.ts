import { Observable, of, throwError, timer } from 'rxjs';
import { retryWhen, switchMap, timeout } from 'rxjs/operators';

class RepeatUntilError<T = any> extends Error {
  constructor(public value: T) {
    super('Result failed to resolve predicate.');
    this.name = 'RepeatUntilError';
  }
}

export const repeatUntil =
  <T>(predicate: (value: T) => boolean, { period = 1000, due = 30000 } = {}) =>
  (source$: Observable<T>) =>
    source$.pipe(
      switchMap((result) => {
        if (!predicate(result)) {
          throw new RepeatUntilError(result);
        }
        return of(result);
      }),
      retryWhen((errors$) =>
        errors$.pipe(
          switchMap((error: Error) =>
            error.name === 'RepeatUntilError' ? timer(period) : throwError(error)
          )
        )
      ),
      timeout(due)
    );
