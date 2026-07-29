import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FakeSessionService } from './service';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  constructor(private fakeSession: FakeSessionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url && this.isDevEnv(request.url)) {
      const params = request.params || new HttpParams();
      const CJSCPPUID = this.fakeSession.getUserId() || '';
      const authenticatedRequest = request.clone({
        params: params.set('CJSCPPUID', CJSCPPUID),
        setHeaders: { CJSCPPUID }
      });
      return next.handle(authenticatedRequest);
    }

    return next.handle(request);
  }

  private isDevEnv(url: string): boolean {
    return (
      url.toLowerCase().includes('devccm') ||
      url.toLowerCase().includes('steccm') ||
      url.toLowerCase().includes('localhost')
    );
  }
}
