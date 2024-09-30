import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private _httpClient: HttpClient) { }

  getAllAuthors(page: number, limit: number): Observable<any> {
    return this._httpClient.get(`${apiUrl}/authors?page=${page}&limit=${limit}`)
  }
  getAuthorById(id: string): Observable<any> {
    return this._httpClient.get(`${apiUrl}/authors/${id}`);
  }
}
