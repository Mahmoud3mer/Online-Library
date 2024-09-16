// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { apiUrl } from '../../util/apiUrl';

// @Injectable({
//   providedIn: 'root'
// })
// export class SearchFilterBooksService {

//   constructor(private _httpClient: HttpClient) { }


//   getFilteredBooks(
//     page: number, 
//     limit: number,
//     category: string,
//     author: string,
//     title: string,
//     sortFor: string,
//     sortBy: string
//   ) : Observable<any>{
//     return this._httpClient.get(
//       `${apiUrl}/books?
//       page=${page}
//       &limit=${limit}
//       &category=${category}
//       &author=${author}
//       &title=${title}
//       &sortField=${sortFor}
//       &sortOrder=${sortBy}`
//     )
//   }
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterBooksService {

  constructor(private _httpClient: HttpClient) { }

  getFilteredBooks(
    page: number, 
    limit: number,
    category: string,
    author: string,
    title: string,
    sortFor: string,
    sortBy: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (category) {
      params = params.set('category', category);
    }
    if (author) {
      params = params.set('author', author);
    }
    if (title) {
      params = params.set('title', title);
    }
    if (sortFor) {
      params = params.set('sortField', sortFor);
    }
    if (sortBy) {
      params = params.set('sortOrder', sortBy);
    }

    return this._httpClient.get(`${apiUrl}/books`, { params });
  }
}
