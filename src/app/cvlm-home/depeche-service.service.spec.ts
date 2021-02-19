import { TestBed, inject } from '@angular/core/testing';

import { DepecheServiceService } from './depeche-service.service';

describe('DepecheServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepecheServiceService]
    });
  });

  it('should be created', inject([DepecheServiceService], (service: DepecheServiceService) => {
    expect(service).toBeTruthy();
  }));
});
