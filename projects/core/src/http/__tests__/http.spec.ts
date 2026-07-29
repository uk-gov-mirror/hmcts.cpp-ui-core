import { HttpClient, HttpHeaders, HttpParams, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { concat, merge, Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { NotificationDispatcher, NotificationEvent } from '../dispatcher';
import { CppHttpBackend, HTTP_CONFIG } from '../http-backend';
import { CppHttp } from '../http-service';
import { GENERATE_UNIQUE_KEY } from '../util';

describe('HttpModule', () => {
  const createEvent = <T extends object = Record<string, unknown>>(
    name: string,
    payload?: T,
    id?: string
  ): NotificationEvent<T> =>
    ({
      ...(payload || {}),
      _metadata: {
        id: id || '*',
        name
      }
    } as NotificationEvent<T>);

  describe('CppHttpBackend', () => {
    let httpBackend: CppHttpBackend;
    let get: jest.Mock;
    let post: jest.Mock;

    beforeEach(() => {
      get = jest.fn();
      post = jest.fn();

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          CppHttpBackend,
          {
            provide: HTTP_CONFIG,
            useValue: {
              baseUrl: 'http://test.url'
            }
          },
          {
            provide: GENERATE_UNIQUE_KEY,
            useValue: () => 'unique!'
          },
          {
            provide: HttpClient,
            useValue: { get, post }
          }
        ]
      });
      httpBackend = TestBed.inject(CppHttpBackend);
    });

    describe('#post', () => {
      it(
        'correctly performs a post request',
        marbles((m) => {
          expect.assertions(6);

          const response$ = m.cold('-(a|)');

          post.mockReturnValue(response$);

          m.expect(
            httpBackend.post('/command', 'command.json', { prop: '*' }).pipe(
              finalize(() => {
                const [url, body, options] = post.mock.calls[0];

                expect(url).toEqual('http://test.url/command');
                expect(body).toEqual({ prop: '*' });
                expect(options.headers.get('Content-Type')).toEqual('command.json');
                expect(options.headers.get('Accept')).toEqual('*/*');
                expect(options.responseType).toEqual('text');
              })
            )
          ).toBeObservable(response$);
        })
      );

      it('provides an empty body where none is specified', () => {
        post.mockReturnValue(new Observable());
        httpBackend.post('/command', 'command.json').subscribe();

        expect(post.mock.calls[0][1]).toEqual({});
      });
    });

    describe('#get', () => {
      it(
        'correctly performs a get request',
        marbles((m) => {
          expect.assertions(3);

          const response$ = m.cold('-(a|)');

          get.mockReturnValue(response$);

          m.expect(
            httpBackend.get('/query', 'query.json').pipe(
              finalize(() => {
                const [url, options] = get.mock.calls[0];

                expect(url).toEqual('http://test.url/query');
                expect(options.headers.get('Accept')).toEqual('query.json');
              })
            )
          ).toBeObservable(response$);
        })
      );

      it('correctly merges any existing headers', () => {
        get.mockReturnValue(new Observable());

        httpBackend
          .get('/query', 'query.json', { headers: new HttpHeaders({ name: '*' }) })
          .subscribe();

        const options = get.mock.calls[0][1];

        expect(options.headers.get('name')).toEqual('*');
      });

      it('attaches a cache-busting query string parameter where `cache` is not truthy', () => {
        get.mockReturnValue(new Observable());

        httpBackend.get('/query', 'query.json', { cache: true }).subscribe();
        expect(get.mock.calls[0][1].params.get('_')).toBeFalsy();

        httpBackend.get('/query', 'query.json').subscribe();
        expect(get.mock.calls[1][1].params.get('_')).toEqual('unique!');
      });
    });
  });

  describe('CppHttp', () => {
    let http: CppHttp;
    let get: jest.Mock;
    let getEvents: jest.Mock;
    let post: jest.Mock;

    beforeEach(() => {
      get = jest.fn();
      post = jest.fn();
      getEvents = jest.fn();

      TestBed.configureTestingModule({
        providers: [
          { provide: CppHttpBackend, useValue: { get, post } },
          { provide: NotificationDispatcher, useValue: { getEvents } },
          { provide: GENERATE_UNIQUE_KEY, useValue: () => 'CORRELATION_ID' },
          CppHttp
        ]
      });
      http = TestBed.inject(CppHttp);
    });

    describe('#command', () => {
      it(
        'performs a post request using the provided options',
        marbles((m) => {
          expect.assertions(5);

          const response$ = m.cold('-(a|)');
          const headers = new HttpHeaders({ name: '*' });

          post.mockReturnValue(response$);

          const command$ = http
            .command({
              body: '*',
              headers,
              requestType: 'command.json',
              url: '/command'
            })
            .pipe(
              finalize(() => {
                const [url, requestType, body, options] = post.mock.calls[0];

                expect(url).toEqual('/command');
                expect(requestType).toEqual('command.json');
                expect(body).toEqual('*');
                expect(options.headers).toEqual(headers);
              })
            );

          m.expect(command$).toBeObservable(response$);
        })
      );
    });

    describe('#commandSync', () => {
      let command: jest.Mock;

      beforeEach(() => {
        command = jest.fn();
        http.command = command;
      });

      it(
        'completes with a new payload when a success event is received',
        marbles((m) => {
          const values = {
            x: createEvent('success.a'),
            y: createEvent('success.b', { _: '*' }),
            z: { _: '*' }
          };
          const response$ = m.cold('-(a|)     ', values);
          const incoming$ = m.cold(' ---x-y---', values);
          const expected$ = m.cold('------(z|)', values);

          command.mockReturnValueOnce(response$);
          getEvents.mockReturnValueOnce(incoming$);

          const config = {
            url: '/command',
            body: 'BODY',
            requestType: 'command.json',
            successEvent: 'success.b'
          };
          const commandSync$ = http.commandSync(config);

          m.expect(commandSync$).toBeObservable(expected$);
          m.flush();

          const { url, requestType, body, headers } = command.mock.calls[0][0];

          expect(url).toEqual('/command');
          expect(requestType).toEqual('command.json');
          expect(body).toEqual('BODY');
          expect(headers.get('CPPCLIENTCORRELATIONID')).toEqual('CORRELATION_ID');
        })
      );

      it(
        'errors the subscription after a failure on the command',
        marbles((m) => {
          const error = 'Something went wrong!';
          const response$ = m.cold('-#', {}, { error });
          const expected$ = m.cold('-#', {}, { error });

          command.mockReturnValue(response$);

          const commandSync$ = http.commandSync({
            url: '/command',
            requestType: 'command.json',
            successEvent: 'event.b'
          });

          m.expect(commandSync$).toBeObservable(expected$);
        })
      );

      it(
        'errors the subscription upon an error notification',
        marbles((m) => {
          const errorEvent = createEvent('error.a', { message: '*' });
          const values = {
            x: createEvent('error.b'),
            y: errorEvent
          };
          const error = {
            status: -1,
            originalEvent: errorEvent,
            data: { message: '*' }
          };
          const response$ = m.cold('-(a|)    ', values);
          const incoming$ = m.cold(' ----x-y|', values);
          const expected$ = m.cold('-------# ', values, error);

          command.mockReturnValueOnce(response$);
          getEvents.mockReturnValueOnce(incoming$);

          const commandSync$ = http.commandSync({
            url: '/command',
            requestType: 'command.json',
            successEvent: 'success.a',
            errorEvent: 'error.a'
          });

          m.expect(commandSync$).toBeObservable(expected$);
        })
      );

      it(
        'errors the subscription upon any response error when multiple are specified',
        marbles((m) => {
          const errorEvent = createEvent('error.b', { message: '*' });
          const values = {
            a: undefined,
            x: errorEvent
          };
          const error = {
            status: -1,
            originalEvent: errorEvent,
            data: { message: '*' }
          };
          const response$ = m.cold('-a|    ', values);
          const incoming$ = m.cold(' ----x|', values);
          const expected$ = m.cold('-----# ', undefined, error);

          command.mockReturnValue(response$);
          getEvents.mockReturnValueOnce(incoming$);

          const commandSync$ = http.commandSync({
            url: '/command',
            requestType: 'command.json',
            successEvent: 'success.a',
            errorEvent: ['error.a', 'error.b']
          });

          m.expect(commandSync$).toBeObservable(expected$);
        })
      );

      it(
        'accepts a timeout that spans the initial request and the response event',
        marbles((m) => {
          const response$ = m.cold('-a|  ');
          const incoming$ = m.cold(' ----');
          const expected$ = m.cold('10s #', undefined, { status: 0 });

          command.mockReturnValue(response$);
          getEvents.mockReturnValueOnce(incoming$);

          const commandSync$ = http.commandSync({
            url: '/command',
            body: '*',
            requestType: 'command.json',
            successEvent: 'success.a',
            timeout: 10000
          });

          m.expect(commandSync$).toBeObservable(expected$);
        })
      );
    });

    describe('#query', () => {
      it(
        'performs a get request using the provided options',
        marbles((m) => {
          expect.assertions(4);

          const response$ = m.cold('-(a|)');
          const headers = new HttpHeaders({ name: '*' });

          get.mockReturnValue(response$);

          const query = http
            .query({
              url: '/query',
              requestType: 'query.json',
              headers
            })
            .pipe(
              finalize(() => {
                const [url, requestType, options] = get.mock.calls[0];

                expect(url).toEqual('/query');
                expect(requestType).toEqual('query.json');
                expect(options.headers).toEqual(headers);
              })
            );

          m.expect(query).toBeObservable(response$);
        })
      );
    });
  });

  describe('NotificationsDispatcher', () => {
    let get: jest.Mock;
    let post: jest.Mock;
    let notificationsDispatcher: NotificationDispatcher;

    beforeEach(() => {
      get = jest.fn();
      post = jest.fn();

      TestBed.configureTestingModule({
        providers: [
          { provide: CppHttpBackend, useValue: { get, post } },
          {
            provide: GENERATE_UNIQUE_KEY,
            useValue: (() => {
              let i = 0;
              return () => `SUBSCRIPTION_ID_${i++}`;
            })()
          },
          NotificationDispatcher
        ]
      });
      notificationsDispatcher = TestBed.inject(NotificationDispatcher);
    });

    describe('#getEvents', () => {
      it(
        'creates a subscription when the first subscription is added',
        marbles((m) => {
          const subscribed$ = m.cold('-(a|)  ');
          const poll$ = m.cold('       ------');
          const done$ = m.cold('      ---(x|)');
          const expected$ = m.cold('  ---|   ');

          post.mockReturnValue(subscribed$);
          get.mockReturnValue(poll$);

          const events$ = notificationsDispatcher.getEvents().pipe(takeUntil(done$));

          m.expect(events$).toBeObservable(expected$);
          m.flush();

          expect(post).toHaveBeenCalledWith(
            `/notification-command-api/command/api/rest/notification/subscriptions/SUBSCRIPTION_ID_0`,
            'application/vnd.notification.subscribe-by-user-id+json'
          );
          expect(post).toHaveBeenCalledTimes(1);
        })
      );

      it(
        'should share a subscription during concurrent polling',
        marbles((m) => {
          const subscribed$ = m.cold('---(a|)');
          const subscribeSub = '      ^--!   ';
          const poll$ = m.cold('       ------');
          const done$ = m.cold('      ---(x|)');
          const expected$ = m.cold('  ---|   ');

          post.mockReturnValueOnce(subscribed$);
          get.mockReturnValueOnce(poll$);

          const events$ = notificationsDispatcher.getEvents().pipe(takeUntil(done$));

          m.expect(merge(events$, events$)).toBeObservable(expected$);
          m.expect(subscribed$).toHaveSubscriptions(subscribeSub);
        })
      );

      it(
        'should reuse a subscription id for future subscriptions',
        marbles((m) => {
          const subscribed$ = m.cold('-(a|)  ');
          const poll$ = m.cold('       ------');
          const done$ = m.cold('      ---(x|)');
          const expected$ = m.cold('  ------|');

          post.mockReturnValue(subscribed$);
          get.mockReturnValue(poll$);

          const events$ = notificationsDispatcher.getEvents().pipe(takeUntil(done$));

          m.expect(concat(events$, events$)).toBeObservable(expected$);
          m.flush();

          expect(post).toHaveBeenCalledTimes(1);
          expect(get.mock.calls[0][0]).toContain('SUBSCRIPTION_ID_0');
          expect(get.mock.calls[1][0]).toContain('SUBSCRIPTION_ID_0');
        })
      );

      it(
        'should retry fetching events when a 403 error is encountered',
        marbles((m) => {
          const subscribe$ = m.cold('-(r|)            ');
          const poll1$ = m.cold('     --#             ', undefined, { status: 403 });
          const poll2$ = m.cold('              ----   ');
          const poll2Sub = '          --- 1.5s ^--!   ';
          const done$ = m.cold('     ---- 1.5s  --(x|)');
          const expected$ = m.cold(' ---- 1.5s  --|   ');

          post.mockReturnValueOnce(subscribe$);
          get.mockReturnValueOnce(poll1$).mockReturnValueOnce(poll2$);

          const events$ = notificationsDispatcher.getEvents().pipe(takeUntil(done$));

          m.expect(events$).toBeObservable(expected$);
          m.expect(poll2$).toHaveSubscriptions(poll2Sub);
        })
      );

      it(
        'polls immediately and then every 1.5 seconds',
        marbles((m) => {
          const a = createEvent('event.a', { _: 'A' }, '1');
          const b = createEvent('event.b', { _: 'B' }, '2');
          const c = createEvent('event.c', { _: 'C' }, '3');

          const subscribed$ = m.cold('-(s|)         ');
          const first$ = m.cold('      -(a|)        ', { a: { events: [a] } });
          const second$ = m.cold('           --(b|) ', { b: { events: [b, c] } });
          const done$ = m.cold('     --- 1.5s ----x|');
          const expected$ = m.cold('  --x 1.5s (yz)|', { x: a, y: b, z: c });

          post.mockReturnValue(subscribed$);
          get.mockReturnValueOnce(first$).mockReturnValueOnce(second$);

          const params = { clientCorrelationId: 'CORRELATION_ID' };
          const events$ = notificationsDispatcher.getEvents(params).pipe(takeUntil(done$));

          m.expect(events$).toBeObservable(expected$);
          m.flush();

          expect(get).toHaveBeenCalledWith(
            `/notification-query-api/query/api/rest/notifications/subscriptions/SUBSCRIPTION_ID_0/events`,
            'application/vnd.notification.events+json',
            { params: new HttpParams({ fromObject: params }) }
          );
        })
      );

      it(
        'does not emit an event for an event id previously received',
        marbles((m) => {
          const a = createEvent('event.a', { _: 'A' }, '1');
          const b = createEvent('event.a', { _: 'B' }, '2');

          const subscribed$ = m.cold('-(s|) ');
          const poll$ = m.cold('       -(a|)', { a: { events: [a, a, b] } });
          const expected$ = m.cold('  --(xy|)', { x: a, y: b });

          post.mockReturnValue(subscribed$);
          get.mockReturnValue(poll$);

          const events$ = notificationsDispatcher.getEvents().pipe(take(2));

          m.expect(events$).toBeObservable(expected$);
        })
      );
    });
  });
});
