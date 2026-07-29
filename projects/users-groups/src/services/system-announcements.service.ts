import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CppHttp } from '@cpp/core';
import { SystemAnnouncement } from '../users-groups.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SystemAnnouncementsService {
  private readonly queryApi = '/systemannouncement-service/rest/systemannouncement';

  constructor(private http: CppHttp) {}

  getSystemAnnouncements(): Observable<SystemAnnouncement[] | undefined> {
    return this.http
      .query<{ systemBannerAnnouncements: SystemAnnouncement[] }>({
        url: `${this.queryApi}/announcements`,
        requestType: 'application/vnd.systemannouncement.get-banner-announcements+json'
      })
      .pipe(map((res) => res.systemBannerAnnouncements));
  }
}
