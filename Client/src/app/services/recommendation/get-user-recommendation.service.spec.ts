import { TestBed } from '@angular/core/testing';

import { GetUserRecommendationService } from './get-user-recommendation.service';

describe('GetUserRecommendationService', () => {
  let service: GetUserRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUserRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
