import { TestBed } from '@angular/core/testing';

import { GetAllCategService } from './get-all-categ.service';

describe('GetAllCategService', () => {
  let service: GetAllCategService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllCategService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
