import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AddBooksService {
  //! for testcode (will retrieve from localstorag)
  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWxpIiwiZW1haWwiOiJtYWhtb2ZkZGRkZEBnbWFpbC5jb20iLCJyb2xlIjoiYXV0aG9yIiwidXNlcklkIjoiNjZkNzY4MjZhM2IwZGMyM2I0NGY4OWY3IiwiaWF0IjoxNzI1ODExNDgzfQ.lJ3fNwQqXN0020Tli049fYRd4NMScViyrXrKqN0dIdE"
  private headers = new HttpHeaders()
  private isBrowser: Boolean = false;
  _httpClient = inject(HttpClient)

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  //! body from form data type because i uploade file
  addNewBook(body: FormData): Observable <any> {
    // ! send token to header
    if (this.isBrowser) {
      // this.token = localStorage.getItem('token');
      if (this.token) {
        this.headers = this.headers.set('token', this.token);
      }
    }

    return this._httpClient.post(`${apiUrl}/books`, body ,{headers: this.headers});
  }

}
