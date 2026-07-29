import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { CapabilitiesService } from './service';

@Injectable()
export class CapabilityRestrictedGuard {
  constructor(private capabilities: CapabilitiesService) {}

  canActivate({ data }: ActivatedRouteSnapshot): Observable<boolean> {
    if (data.requireCapabilityEnabled) {
      return of(this.capabilities.getCapabilityEnabled(data.requireCapabilityEnabled));
    }
    if (data.requireCapabilityDisabled) {
      return of(!this.capabilities.getCapabilityEnabled(data.requireCapabilityDisabled));
    }
    return throwError(`No capability provided to capability-restricted route!`);
  }
}
