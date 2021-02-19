import { TestBed, inject } from '@angular/core/testing';

import { CarteServiceService } from './carte-service.service';

describe('CarteServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarteServiceService]
    });
  });

  it('should be created', inject([CarteServiceService], (service: CarteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
