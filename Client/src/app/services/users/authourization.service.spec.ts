import { TestBed } from '@angular/core/testing';

import { AuthourizationService } from './authourization.service';

describe('AuthourizationService', () => {
  let service: AuthourizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthourizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
