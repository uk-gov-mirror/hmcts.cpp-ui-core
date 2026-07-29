declare global {
  interface Window {
    dtrum?: RealUserMonitoring;
  }
}

export interface RealUserMonitoring {
  defendantsAndOffencesCount?: string;
  userGroups?: string[];
  userName?: string;

  enable(): void;
  enableSessionReplay(): void;
  disable(): void;
  disableSessionReplay(): void;
  enterAction(
    actionName: string,
    actionType?: string,
    startTime?: number,
    sourceUrl?: string
  ): number;
  leaveAction(actionId: number, stopTime?: number, startTime?: number): void;
}
