import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { CppHttp, mapObjectToHttpParams } from '@cpp/core';
import { ReferenceDataService } from '../reference-data.service';

describe('ReferenceDataService', () => {
  let service: ReferenceDataService;
  let http: CppHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReferenceDataService,
        {
          provide: CppHttp,
          useValue: {
            query: jest.fn()
          }
        }
      ]
    });
    http = TestBed.inject(CppHttp);
    service = TestBed.inject(ReferenceDataService);
  });

  describe('fetchApplicationTypes()', () => {
    it('should fetch application types', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ courtApplicationTypes: [] }));

      service.fetchApplicationTypes().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/application-types',
          requestType: 'application/vnd.referencedata.application-types+json'
        });
      });
    });
  });

  describe('fetchAssignPriorities()', () => {
    it('should fetch assign priorities', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ hearingPriorities: [] }));

      service.fetchAssignPriorities().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/hearing-priorities',
          requestType: 'application/vnd.referencedata.query.hearing-priorities+json'
        });
      });
    });
  });

  describe('fetchBookingTypes()', () => {
    it('should fetch booking types', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ bookingTypes: [] }));

      service.fetchBookingTypes().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/booking-types',
          requestType: 'application/vnd.referencedata.query.booking-types+json'
        });
      });
    });
  });

  describe('fetchClusters()', () => {
    it('should fetch clusters', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ clusterInformation: [] }));

      service.fetchClusters().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/cluster-information',
          requestType: 'application/vnd.referencedata.query.cluster-information+json'
        });
      });
    });
  });

  describe('fetchCPSAreas()', () => {
    it('should fetch cps areas', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ cpsAreas: [] }));

      service.fetchCPSAreas().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/cps-areas',
          requestType: 'application/vnd.referencedata.query.cps-area+json'
        });
      });
    });
  });

  describe('fetchCPSBusinessUnits()', () => {
    it('should fetch cps business units', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ cpsBusinessUnits: [] }));

      service.fetchCPSBusinessUnits().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/cps-business-units',
          requestType: 'application/vnd.referencedata.query.cps-business-unit+json'
        });
      });
    });
  });

  describe('fetchCPSCaseStatuses()', () => {
    it('should fetch cps case statuses', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ cpsCaseStatuses: [] }));

      service.fetchCPSCaseStatuses().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/cps-case-statuses',
          requestType: 'application/vnd.referencedata.query.cps-case-statuses+json'
        });
      });
    });
  });

  describe('fetchFixedLists()', () => {
    it('should fetch fixed lists', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ fixedListCollection: [] }));

      service.fetchFixedLists().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/fixed-list',
          requestType: 'application/vnd.referencedata.get-all-fixed-list+json'
        });
      });
    });
  });

  describe('fetchHearingTypes()', () => {
    it('should fetch hearing types', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ hearingTypes: [] }));

      service.fetchHearingTypes().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/hearing-types',
          requestType: 'application/vnd.referencedata.query.hearing-types+json'
        });
      });
    });
  });

  describe('fetchLocalJusticAreas()', () => {
    it('should fetch local justice areas', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ localJusticeAreas: [] }));

      service.fetchLocalJusticAreas().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/local-justice-areas',
          requestType: 'application/vnd.referencedata.query.local-justice-areas+json'
        });
      });
    });
  });

  describe('fetchOrganisationUnits()', () => {
    it('should fetch organisation units', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ organisationunits: [] }));

      service.fetchOrganisationUnits().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/organisationunits',
          requestType: 'application/vnd.referencedata.query.organisationunits+json'
        });
      });
    });
  });

  describe('fetchPoliceForceList()', () => {
    it('should fetch Police Force List', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ policeForces: [] }));

      service.fetchPoliceForceList().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/police-forces',
          requestType: 'application/vnd.referencedata.police-forces+json'
        });
      });
    });
  });

  describe('fetchProsecutors()', () => {
    it('should fetch prosecutors', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ prosecutors: [] }));

      service.fetchProsecutors().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/prosecutors',
          requestType: 'application/vnd.referencedata.query.prosecutors-with-nsp+json'
        });
      });
    });
  });

  describe('fetchResultDefinition()', () => {
    it('should fetch a result definition', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ id: 'resultDefinitionId' }));

      service.fetchResultDefinition('resultDefinitionId').subscribe((result) => {
        expect(result).toEqual({ id: 'resultDefinitionId' });
        expect(http.query).toHaveBeenCalledWith({
          url: `/referencedata-query-api/query/api/rest/referencedata/result-definitions/resultDefinitionId`,
          requestType: 'application/vnd.referencedata.get-result-definition+json'
        });
      });
    });
  });

  describe('fetchResultDefinitions()', () => {
    it('should fetch all result definitions', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ resultDefinitions: [] }));

      service.fetchResultDefinitions().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/result-definitions',
          requestType: 'application/vnd.referencedata.get-all-result-definitions+json'
        });
      });
    });
  });

  describe('fetchRotaBusinessTypes()', () => {
    it('should fetch all rota business types', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ rotaBusinessTypes: [] }));

      service.fetchRotaBusinessTypes().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/rota-business-types',
          requestType: 'application/vnd.referencedata.query.rota-business-types+json'
        });
      });
    });
  });

  describe('fetchPleaTypes()', () => {
    it('should fetch all plea types', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ pleaStatusTypes: [] }));

      service.fetchPleaTypes().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/plea-types',
          requestType: 'application/vnd.referencedata.plea-types+json'
        });
      });
    });
  });

  describe('fetchSpecialRequirements()', () => {
    it('should fetch special requirements', () => {
      expect.assertions(2);

      (http.query as jest.Mock).mockReturnValue(of({ specialRequirements: [] }));

      service.fetchSpecialRequirements().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/special-requirements',
          requestType: 'application/vnd.referencedata.query.special-requirements+json'
        });
      });
    });
  });

  describe('fetchWitnessCareUnits()', () => {
    it('should fetch witness care units', () => {
      (http.query as jest.Mock).mockReturnValue(of({ witnessCareUnits: [] }));

      service.fetchPleaTypes().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/witness-care-units',
          requestType:
            'application/vnd.referencedata.query.witness-care-unit-with-police-force-code+json'
        });
      });
    });
  });

  describe('fetchJudicialMembers()', () => {
    it('should fetch judicial members', () => {
      (http.query as jest.Mock).mockReturnValue(of({ judiciaries: [] }));

      service.fetchJudicialMembers({}).subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/judiciaries',
          requestType: 'application/vnd.reference-data.judiciaries+json'
        });
      });
    });
  });

  describe('searchApplicationTypes()', () => {
    it('should search application types', () => {
      expect.assertions(2);

      const params = { q: '*', limit: 10 };
      (http.query as jest.Mock).mockReturnValue(of({ courtApplicationTypes: [] }));

      service.searchApplicationTypes(params).subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/application-types',
          requestType: 'application/vnd.referencedata.application-types+json',
          params: mapObjectToHttpParams(params)
        });
      });
    });
  });

  describe('searchApplicationStandAloneTypes()', () => {
    it('should stand alone search application types', (done) => {
      expect.assertions(2);

      const params = { search: '*', limit: 10 };
      (http.query as jest.Mock).mockReturnValue(of({ courtApplicationTypes: [] }));

      service.searchApplicationStandAloneTypes(params).subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/referencedata-moj-offences',
          requestType: 'application/vnd.referencedata.query.moj-offences+json',
          params: mapObjectToHttpParams(params)
        });
        done();
      });
    });
  });

  describe('getPoliceRanks()', () => {
    it('should get the police ranks ', () => {
      (http.query as jest.Mock).mockReturnValue(of({ policeRanks: [] }));
      service.fetchPoliceRanks().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/police-ranks',
          requestType: 'application/vnd.referencedata.police-ranks+json'
        });
      });
    });
  });
  describe('fetchPublicHolidays()', () => {
    it('should fetch public holidays', () => {
      (http.query as jest.Mock).mockReturnValue(of({ publicHolidays: [] }));

      service.fetchPublicHolidays().subscribe((result) => {
        expect(result).toEqual([]);
        expect(http.query).toHaveBeenCalledWith({
          url: '/referencedata-query-api/query/api/rest/referencedata/public-holidays',
          requestType: 'application/vnd.referencedata.query.public-holidays+json'
        });
      });
    });
  });
});
