import { TestBed } from '@angular/core/testing';
import { CppHttp } from '@cpp/core';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SystemAnnouncementsService } from '../system-announcements.service';
import {
  AnnouncementCategory,
  AnnouncementType,
  SystemAnnouncement
} from '../../users-groups.interfaces';

describe('SystemAnnouncementService', () => {
  let service: SystemAnnouncementsService;
  let http: CppHttp;

  const mockApiResponse = {
    systemBannerAnnouncements: [
      {
        id: 'test-announcement',
        createdBy: 'test-user',
        category: AnnouncementCategory.PLANNED,
        type: AnnouncementType.INFORMATION,
        startDate: '2023-12-01',
        endDate: '2023-12-02',
        startTime: '10:00',
        endTime: '18:00',
        title: 'Test Announcement',
        details: 'Test details',
        createdAt: '2023-11-30T10:00:00Z'
      }
    ] as SystemAnnouncement[]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SystemAnnouncementsService,
        {
          provide: CppHttp,
          useValue: {
            query: jest.fn()
          }
        }
      ]
    });
    http = TestBed.inject(CppHttp);
    service = TestBed.inject(SystemAnnouncementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSystemAnnouncements', () => {
    it('should call API and return announcements', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of(mockApiResponse));

      service.getSystemAnnouncements().subscribe((announcements) => {
        expect(announcements).toEqual(mockApiResponse.systemBannerAnnouncements);
        expect(http.query).toHaveBeenCalledWith({
          url: '/systemannouncement-service/rest/systemannouncement/announcements',
          requestType: 'application/vnd.systemannouncement.get-banner-announcements+json'
        });
      });
    });

    it('should return empty array if API returns empty data', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ systemBannerAnnouncements: [] }));

      service.getSystemAnnouncements().subscribe((announcements) => {
        expect(announcements).toEqual([]);
        expect(http.query).toHaveBeenCalled();
      });
    });

    it('should propagate errors from the API', () => {
      expect.assertions(1);
      const errorResponse = new HttpErrorResponse({ status: 400 });

      (http.query as jest.Mock).mockReturnValue(throwError(errorResponse));

      service.getSystemAnnouncements().subscribe(
        () => {},
        (error) => {
          expect(error instanceof HttpErrorResponse).toBeTruthy();
        }
      );
    });
  });
});
