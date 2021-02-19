import { TestBed, inject } from '@angular/core/testing';

import { DescriptionServiceService } from './description-service.service';

describe('DescriptionServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescriptionServiceService]
    });
  });

  it('should be created', inject([DescriptionServiceService], (service: DescriptionServiceService) => {
    expect(service).toBeTruthy();
  }));
});
