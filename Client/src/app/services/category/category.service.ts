import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _httpClient : HttpClient) { }

  getAllCategory(page: number, limit: number) : Observable<any> {
    return this._httpClient.get<any>(`${apiUrl}/category?page=${page}&limit=${limit}`)
  }
}
