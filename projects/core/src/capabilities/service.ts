import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CppHttpBackend } from '../http/http-backend';

export const CAPABILITIES_CONFIG = new InjectionToken('CAPABILITIES_CONFIG');

export interface CapabilitiesConfig {
  manifestPath: string;
}

export interface Capability {
  name: string;
  type: string;
  description: string;
}

export interface CapabilityStatus extends Capability {
  enabled: boolean;
}

@Injectable()
export class CapabilitiesService {
  private capabilities: CapabilityStatus[] = [];

  constructor(
    @Inject(CAPABILITIES_CONFIG) private config: CapabilitiesConfig,
    private httpClient: HttpClient,
    private injector: Injector
  ) {}

  loadCapabilites(): Observable<CapabilityStatus[]> {
    // fetch the manifest file - this is the capability specification
    // belonging to an application, and its path is configurable
    const fetchManifest$ = this.httpClient
      .get<{ capabilities: Capability[] }>(this.config.manifestPath)
      .pipe(map((data) => data.capabilities));

    // fetch the capability statuses from the server, to determine whether
    // a capability defined in the manifest is enabled or disabled
    const fetchStatuses$ = this.injector
      .get<CppHttpBackend>(CppHttpBackend)
      .get<{ capabilities: CapabilityStatus[] }>(
        `/authorisation-service-server/rest/capabilities?type=ui`,
        'application/vnd.authorisation.capabilities+json'
      )
      .pipe(map((data) => data.capabilities));

    // Return an intersection of capabilities defined in the manifest and
    // those whose `enabled` statuses are defined remotely. This will,
    // therefore, deliberately disregard any capabilities who exist in one place
    // only, as their intended behaviour cannot be determined
    return combineLatest([fetchManifest$, fetchStatuses$]).pipe(
      map(([manifest, statuses]) =>
        statuses.reduce((capabilities, sc) => {
          const mc = manifest.find((item) => sc.name === item.name);
          if (mc) {
            return [...capabilities, { ...sc, ...mc }];
          }
          return capabilities;
        }, [] as CapabilityStatus[])
      ),
      tap((capabilities) => {
        this.capabilities = capabilities;
      })
    );
  }

  getCapabilityEnabled(name: string): boolean {
    const capability = this.capabilities.find((c) => c.name === name);

    if (!capability) {
      throw new Error(`
        The capability '${name}' was not recognised. Please ensure that the capability exists
        in the capabilities manifest, and that it has been attributed an \`enabled\` status.
      `);
    }
    return capability.enabled;
  }
}
