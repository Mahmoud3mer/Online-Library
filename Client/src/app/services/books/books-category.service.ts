import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
import { BookInterface } from '../../interfaces/books.interface';

@Injectable({
  providedIn: 'root'
})
export class BooksCategoryService {

  constructor(private _httpClient : HttpClient) { }

  getBooksByCategory(page: number, limit: number) : Observable<any> {
    return this._httpClient.get<any>(`${apiUrl}/category?page=${page}&limit=${limit}`)
  }
}
