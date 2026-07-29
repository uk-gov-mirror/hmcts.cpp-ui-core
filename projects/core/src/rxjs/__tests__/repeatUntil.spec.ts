import { Observable, of, TimeoutError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { switchMap } from 'rxjs/operators';
import { repeatUntil } from '../repeatUntil';

describe('repeatUntil', () => {
  it(
    'should repeat the source observable until the predicate can resolve the result',
    marbles(m => {
      const attempt1$ = m.cold('--(a|)      ', { a: 0 });
      const attempt2$ = m.cold('      --(b|)', { b: 1 });
      const expected$ = m.cold('-- 1s --(b|)', { b: 1 });

      const getValue: () => Observable<number> = jest
        .fn()
        .mockReturnValueOnce(attempt1$)
        .mockReturnValueOnce(attempt2$);

      const source$ = of(null).pipe(
        switchMap(getValue),
        repeatUntil(value => value > 0)
      );
      m.expect(source$).toBeObservable(expected$);
    })
  );

  it(
    'should allow a regular error to pass through',
    marbles(m => {
      const error = new Error('*');
      const attempt$ = m.cold(' --#', undefined, error);
      const expected$ = m.cold('--#', undefined, error);

      const getValue = () => attempt$;

      const source$ = of(null).pipe(
        switchMap(getValue),
        repeatUntil(value => value > 0)
      );
      m.expect(source$).toBeObservable(expected$);
    })
  );

  it(
    'should time out after a default period',
    marbles(m => {
      const attempt$ = m.cold(' ----a', { a: 0 });
      const expected$ = m.cold('30s #', undefined, new TimeoutError());

      const getValue = () => attempt$;

      const source$ = of(null).pipe(
        switchMap(getValue),
        repeatUntil(value => value > 0)
      );
      m.expect(source$).toBeObservable(expected$);
    })
  );

  it(
    'should accept options to adapt the repeat and timeout periods',
    marbles(m => {
      const attempt1$ = m.cold('--(a|)        ', { a: 0 });
      const attempt2$ = m.cold('     ---------');
      const attempt2Subs = '-- 750ms ^ 247ms !';
      const expected$ = m.cold('1s           #', undefined, new TimeoutError());

      const getValue: () => Observable<number> = jest
        .fn()
        .mockReturnValueOnce(attempt1$)
        .mockReturnValueOnce(attempt2$);

      const source$ = of(null).pipe(
        switchMap(getValue),
        repeatUntil(value => value > 0, { period: 750, due: 1000 })
      );
      m.expect(source$).toBeObservable(expected$);
      m.expect(attempt2$).toHaveSubscriptions(attempt2Subs);
    })
  );
});
