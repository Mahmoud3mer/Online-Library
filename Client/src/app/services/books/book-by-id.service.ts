import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class BookByIdService {

  constructor(private _httpClient:HttpClient) { }

  getBookById(bookId : string) : Observable<any> {
    return this._httpClient.get(`${apiUrl}/books/${bookId}`)
  }
  
}
