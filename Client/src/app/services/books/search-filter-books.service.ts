import { HttpClient } from '@angular/common/http';
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
  ) : Observable<any>{
    return this._httpClient.get(
      `${apiUrl}/books?
      page=${page}
      &limit=${limit}
      &category=${category}
      &author=${author}
      &title=${title}
      &sortField=${sortFor}
      &sortOrder=${sortBy}`
    )
  }
}
