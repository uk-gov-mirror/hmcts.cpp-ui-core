import * as Dynatrace from './dynatrace.interfaces';

export class DynatraceRealUserMonitoringMock implements Dynatrace.RealUserMonitoring {
  enable() {
    /* eslint-disable no-console */
    console.info('DynatraceRealUserMonitoringMock#enable()');
  }
  disable() {
    /* eslint-disable no-console */
    console.info('DynatraceRealUserMonitoringMock#disable()');
  }
  enableSessionReplay() {}
  disableSessionReplay() {}
  enterAction() {
    return 0;
  }
  leaveAction() {}
}
