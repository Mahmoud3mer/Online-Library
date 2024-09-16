import { TestBed } from '@angular/core/testing';

import { CreateRecommendationService } from './create-recommendation.service';

describe('CreateRecommendationService', () => {
  let service: CreateRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
