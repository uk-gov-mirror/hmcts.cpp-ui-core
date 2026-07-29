import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export const INITIAL_USER_ID = new InjectionToken<string>('INITIAL_USER_ID');

type UserIdCallbackFn = (userId: string | null) => void;

@Injectable()
export class FakeSessionService {
  listeners: [string, UserIdCallbackFn][] = [];
  constructor(@Optional() @Inject(INITIAL_USER_ID) userId: string) {
    if (userId) {
      this.setUserId(userId);
    }
  }

  clear() {
    this.setUserId(null);
  }

  getUserId() {
    return window.localStorage.getItem('CJSCPPUID');
  }

  setUserId(cjscppuid: string | null) {
    if (cjscppuid) {
      window.localStorage.setItem('CJSCPPUID', cjscppuid);
    } else {
      window.localStorage.removeItem('CJSCPPUID');
    }
    this.listeners.forEach(([eventName, callback]) => {
      if (eventName === 'CJSCPPUID') {
        callback(cjscppuid);
      }
    });
  }

  addListener(eventName: string, fn: UserIdCallbackFn) {
    this.listeners = [...this.listeners, [eventName, fn]];
  }

  removeListener(eventName: string, fn: UserIdCallbackFn) {
    this.listeners = this.listeners.filter((item) => item[0] !== eventName && item[1] !== fn);
  }
}
