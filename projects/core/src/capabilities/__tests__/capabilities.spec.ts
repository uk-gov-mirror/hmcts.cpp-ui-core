import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { marbles } from 'rxjs-marbles/jest';
import { finalize } from 'rxjs/operators';

import { CapabilitiesService } from '../service';
import { CppHttpBackend } from '../../http/http-backend';
import { CapabilityRestrictedGuard } from '../guards';
import { provideCppCapabilities } from '../providers';
import { provideCppCoreHttpServices } from '../../http/providers';
import {
  CapabilityEnabledComponent as CapabilityEnabledDirective,
  CapabilityDisabledComponent as CapabilityDisabledDirective
} from '../directives';

describe('CapabilitiesModule', () => {
  describe('CapabilitiesService', () => {
    let getManifest: jest.Mock;
    let getStatuses: jest.Mock;
    let http: CppHttpBackend;
    let httpClient: HttpClient;
    let service: CapabilitiesService;

    beforeEach(() => {
      getManifest = jest.fn();
      getStatuses = jest.fn();

      TestBed.configureTestingModule({
        providers: [
          provideCppCoreHttpServices(),
          {
            provide: HttpClient,
            useValue: {
              get: getManifest
            }
          },
          {
            provide: CppHttpBackend,
            useValue: {
              get: getStatuses
            }
          },
          provideCppCapabilities({ manifestPath: '/manifest.json' })
        ]
      });
      http = TestBed.inject(CppHttpBackend);
      httpClient = TestBed.inject(HttpClient);
      service = TestBed.inject(CapabilitiesService);
    });

    describe('#load', () => {
      it(
        'resolves and caches a list of enabled capabilities',
        marbles((m) => {
          expect.assertions(4);

          const manifest = {
            capabilities: [
              { name: 'capability.a', type: 'ui.component', description: '*' },
              { name: 'capability.b', type: 'ui.component', description: '*' }
            ]
          };
          const statuses = {
            capabilities: [
              { name: 'capability.a', enabled: true },
              { name: 'capability.b', enabled: false }
            ]
          };
          const capabilities = [
            { name: 'capability.a', type: 'ui.component', description: '*', enabled: true },
            { name: 'capability.b', type: 'ui.component', description: '*', enabled: false }
          ];
          const manifest$ = m.cold('-(a|)', { a: manifest });
          const statuses$ = m.cold('-(b|)', { b: statuses });
          const expected$ = m.cold('-(c|)', { c: capabilities });

          getManifest.mockReturnValue(manifest$);
          getStatuses.mockReturnValue(statuses$);

          const loadCapabilities$ = service.loadCapabilites().pipe(
            finalize(() => {
              expect(httpClient.get).toHaveBeenCalledWith('/manifest.json');
              expect(http.get).toHaveBeenCalledWith(
                `/authorisation-service-server/rest/capabilities?type=ui`,
                'application/vnd.authorisation.capabilities+json'
              );
              expect(service['capabilities']).toEqual(capabilities);
            })
          );

          m.expect(loadCapabilities$).toBeObservable(expected$);
        })
      );

      it(
        'requires a cross-section of the enabled capabilities with those defined in the manifest',
        marbles((m) => {
          expect.assertions(1);

          const manifest = {
            capabilities: [{ name: 'capability.a', type: 'ui.component', description: '*' }]
          };
          const statuses = {
            capabilities: [
              { name: 'capability.a', type: 'ui.component', enabled: true },
              { name: 'capability.b', type: 'ui.component', enabled: false }
            ]
          };
          const capabilities = [
            { name: 'capability.a', type: 'ui.component', description: '*', enabled: true }
          ];
          const manifest$ = m.cold('-(a|)', { a: manifest });
          const statuses$ = m.cold('-(b|)', { b: statuses });
          const expected$ = m.cold('-(c|)', { c: capabilities });

          getManifest.mockReturnValue(manifest$);
          getStatuses.mockReturnValue(statuses$);

          m.expect(service.loadCapabilites()).toBeObservable(expected$);
        })
      );
    });

    describe('#getCababilityEnabled', () => {
      beforeEach(() => {
        service['capabilities'] = [
          { name: 'capability.a', type: 'ui.component', description: '*', enabled: true },
          { name: 'capability.b', type: 'ui.component', description: '*', enabled: false }
        ] as any[];
      });

      it('returns a boolean according to a capability being enabled', () => {
        expect(service.getCapabilityEnabled('capability.a')).toEqual(true);
        expect(service.getCapabilityEnabled('capability.b')).toEqual(false);
      });

      it('throws an error when a capability is not recognised', () => {
        expect(() => service.getCapabilityEnabled('capability.c')).toThrow();
      });
    });
  });

  describe('CapabilityRestrictedGuard', () => {
    let getCapabilityEnabled: jest.Mock;
    let guard: CapabilityRestrictedGuard;

    beforeEach(() => {
      getCapabilityEnabled = jest.fn();

      TestBed.configureTestingModule({
        providers: [
          provideCppCoreHttpServices(),
          provideCppCapabilities({ manifestPath: '/manifest.json' }),
          { provide: CapabilitiesService, useValue: { getCapabilityEnabled } }
        ]
      });
      guard = TestBed.inject(CapabilityRestrictedGuard);
    });

    it(
      'restricts access to disabled routes',
      marbles((m) => {
        let canActivate$;
        let expected$;

        const activate = (requireCapabilityEnabled: string) =>
          guard.canActivate({
            data: { requireCapabilityEnabled }
          } as any);

        getCapabilityEnabled.mockReturnValueOnce(true);

        canActivate$ = activate('capability.a');
        expected$ = m.cold('(a|)', { a: true });

        expect(getCapabilityEnabled).toHaveBeenCalledWith('capability.a');
        m.expect(canActivate$).toBeObservable(expected$);

        getCapabilityEnabled.mockReturnValueOnce(false);

        canActivate$ = activate('capability.a');
        expected$ = m.cold('(a|)', { a: false });

        m.expect(canActivate$).toBeObservable(expected$);
      })
    );

    it(
      'restricts access to disabled routes',
      marbles((m) => {
        let canActivate$;
        let expected$;

        const activate = (requireCapabilityDisabled: string) =>
          guard.canActivate({
            data: { requireCapabilityDisabled }
          } as any);

        getCapabilityEnabled.mockReturnValueOnce(false);

        canActivate$ = activate('capability.a');
        expected$ = m.cold('(a|)', { a: true });

        expect(getCapabilityEnabled).toHaveBeenCalledWith('capability.a');
        m.expect(canActivate$).toBeObservable(expected$);

        getCapabilityEnabled.mockReturnValueOnce(true);

        canActivate$ = activate('capability.a');
        expected$ = m.cold('(a|)', { a: false });

        m.expect(canActivate$).toBeObservable(expected$);
      })
    );

    it(
      'throws an error when no capability requirement is specified',
      marbles((m) => {
        const canActivate$ = guard.canActivate({ data: {} } as any);
        const expected = m.cold(
          '#',
          undefined,
          'No capability provided to capability-restricted route!'
        );

        m.expect(canActivate$).toBeObservable(expected);
      })
    );
  });

  describe('[capability-enabled]', () => {
    let getCapabilityEnabled: jest.Mock;

    beforeEach(() => {
      getCapabilityEnabled = jest.fn();

      TestBed.configureTestingModule({
        imports: [CapabilityEnabledDirective],
        declarations: [CapabilityEnabledComponent],
        providers: [
          provideCppCoreHttpServices(),
          provideCppCapabilities({ manifestPath: '/manifest.json' }),
          {
            provide: CapabilitiesService,
            useValue: { getCapabilityEnabled }
          }
        ]
      });
    });

    it('removes any element from the DOM when a capability is disabled', async () => {
      const fixture = TestBed.createComponent(CapabilityEnabledComponent);
      getCapabilityEnabled.mockReturnValue(true);
      fixture.detectChanges();
      expect(getCapabilityEnabled).toHaveBeenCalledWith('capability.a');
      await fixture.whenRenderingDone();
      await fixture.whenStable();
      expect(fixture.debugElement.query(By.css('p'))).toBeTruthy();
      getCapabilityEnabled.mockReturnValue(false);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('p'))).toBeFalsy();
    });

    @Component({
      selector: 'capability-enabled',
      template: ` <div capability-enabled="capability.a"><p>PDK!</p></div> `,
      standalone: false
    })
    class CapabilityEnabledComponent {}
  });

  describe('[capability-disabled]', () => {
    let getCapabilityEnabled: jest.Mock;

    beforeEach(() => {
      getCapabilityEnabled = jest.fn();

      TestBed.configureTestingModule({
        imports: [CapabilityDisabledDirective],
        declarations: [CapabilityDisabledComponent],
        providers: [
          provideCppCoreHttpServices(),
          provideCppCapabilities({ manifestPath: '/manifest.json' }),
          {
            provide: CapabilitiesService,
            useValue: { getCapabilityEnabled }
          }
        ]
      });
    });

    it('removes any element from the DOM when a capability is enabled', async () => {
      const fixture = TestBed.createComponent(CapabilityDisabledComponent);

      getCapabilityEnabled.mockReturnValue(false);
      fixture.detectChanges();

      expect(getCapabilityEnabled).toHaveBeenCalledWith('capability.a');
      await fixture.whenRenderingDone();
      await fixture.whenStable();
      expect(fixture.debugElement.query(By.css('p'))).toBeTruthy();

      getCapabilityEnabled.mockReturnValue(true);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('p'))).toBeFalsy();
    });

    @Component({
      selector: 'capability-disabled',
      template: ` <div capability-disabled="capability.a"><p>PDK!</p></div> `,
      standalone: false
    })
    class CapabilityDisabledComponent {}
  });
});
