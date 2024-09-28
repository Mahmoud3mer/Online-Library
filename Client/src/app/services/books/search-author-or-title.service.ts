import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class SearchAuthorOrTitleService {

  constructor(private _httpClient: HttpClient) { }


  searchBooksByAuthorOrTitle(author: string, title: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('author', author)
      .set('title', title)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this._httpClient.get(`${apiUrl}/books/search`, { params });
  }
}
