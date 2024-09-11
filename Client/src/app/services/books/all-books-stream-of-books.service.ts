import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AllBooksStreamOfBooksService {

  constructor(private _httpClient: HttpClient) { }


  getAllBooks(): Observable<any> {
    return this._httpClient.get(`${apiUrl}/books`)
  }

  getStreamOfBooks(page: number, limit: number): Observable<any> {
    return this._httpClient.get(`${apiUrl}/books?page=${page}&limit=${limit}`)
  }
}
