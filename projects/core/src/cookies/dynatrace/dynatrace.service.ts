import { Inject, Injectable, InjectionToken } from '@angular/core';
import * as Dynatrace from './dynatrace.interfaces';

export const Dtrum = new InjectionToken('DynatraceRealUserMonitoring');

@Injectable({ providedIn: 'root' })
export class DynatraceService {
  private didStartSession = false;
  private spinnerWheelActionId: number | undefined;

  constructor(@Inject(Dtrum) private dtrum: Dynatrace.RealUserMonitoring) {}

  start() {
    if (!this.didStartSession) {
      this.dtrum.enable();
      this.dtrum.enableSessionReplay();
      this.didStartSession = true;
    }
  }

  stop() {
    if (this.didStartSession) {
      this.dtrum.disable();
      this.dtrum.disableSessionReplay();
      this.didStartSession = false;
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  trackUserGroups(groupNames: string[]): void {
    if (this.didStartSession && !!groupNames) {
      this.dtrum.userGroups = groupNames;
    }
  }

  trackUserName(email: string): void {
    if (this.didStartSession && !!email) {
      this.dtrum.userName = email;
    }
  }

  trackCaagData(defendantsAndOffencesCount: string): void {
    if (this.didStartSession && !!defendantsAndOffencesCount) {
      this.dtrum.defendantsAndOffencesCount = defendantsAndOffencesCount;
    }
  }

  unTrackCaagData(): void {
    if (this.didStartSession) {
      delete this.dtrum.defendantsAndOffencesCount;
    }
  }

  enterAction(
    actionName: string,
    actionType?: string,
    startTime?: number,
    sourceUrl?: string
  ): number | null {
    if (this.didStartSession) {
      return this.dtrum.enterAction(actionName, actionType, startTime, sourceUrl);
    }
    return null;
  }

  leaveAction(actionId: number, stopTime?: number, startTime?: number): void {
    if (this.didStartSession && !!actionId) {
      this.dtrum.leaveAction(actionId, stopTime, startTime);
    }
  }
}
