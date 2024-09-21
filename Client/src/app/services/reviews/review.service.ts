import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
import { isPlatformBrowser } from '@angular/common';
import { ReviewInterface } from '../../interfaces/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private isBrowser: Boolean = false;
  private headers = new HttpHeaders()
  private token: any = "";
  _httpClient = inject(HttpClient)

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.headers = this.headers.set('token', this.token.slice(1,this.token.length - 1)); 
        console.log(this.token);
        console.log(this.token.slice(1,this.token.length - 1));
        
      }
    }
  }

  getAllReviews(bookId: any): Observable <any> {
    return this._httpClient.get(`${apiUrl}/review/book/${bookId}`);
  }

  getPaginationReviews(bookId: any, page: number ,limit: number): Observable <any> {
    return this._httpClient.get(`${apiUrl}/review/book/${bookId}?page=${page}&limit=${limit}`);
  }

  getOneReview(reviewId: string): Observable <any> {
    return this._httpClient.get(`${apiUrl}/review/${reviewId}`);
  }

  addReview(body: ReviewInterface): Observable <any> {
    return this._httpClient.post(`${apiUrl}/review`, body , {headers: this.headers});
  }

  updateReview(reviewId: string, body: any): Observable <any> {
    return this._httpClient.put(`${apiUrl}/review/${reviewId}`, body , {headers: this.headers});
  }
  
  deleteReview(reviewId: string): Observable <any> {
    return this._httpClient.delete(`${apiUrl}/review/${reviewId}`, {headers: this.headers});
  }
}
