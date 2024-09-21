import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
  

@Injectable({
  providedIn: 'root'
})
export class BooksByCategoriesService {

  constructor(private _httpClient: HttpClient) { }

  getBooksByRecommendation(page: number, limit: number, categories: string): Observable<any> {
    return this._httpClient.get<any>(`${apiUrl}/books/recommendations?page=${page}&limit=${limit}&categories=${categories}`);
  }
}
