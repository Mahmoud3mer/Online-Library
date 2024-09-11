import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  _httpClient = inject(HttpClient)

  constructor() {
  }

  getAllReviews(): Observable <any> {
    return this._httpClient.get(`${apiUrl}/review`);
  }

  addReview(body: any): Observable <any> {
    return this._httpClient.post(`${apiUrl}/review`, body);
  }

  updateReview(reviewId: string, body: any): Observable <any> {
    return this._httpClient.put(`${apiUrl}/review/:${reviewId}`, body);
  }
  
  deleteReview(reviewId: string): Observable <any> {
    return this._httpClient.delete(`${apiUrl}/review/:${reviewId}`);
  }


}
