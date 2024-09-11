import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
import { isPlatformBrowser } from '@angular/common';
import { BookInterface } from '../../interfaces/books.interface';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  //! for testcode (will retrieve from localstorag)
  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWxpIiwiZW1haWwiOiJtYWhtb2ZkZGRkZEBnbWFpbC5jb20iLCJyb2xlIjoiYXV0aG9yIiwidXNlcklkIjoiNjZkNzY4MjZhM2IwZGMyM2I0NGY4OWY3IiwiaWF0IjoxNzI1ODExNDgzfQ.lJ3fNwQqXN0020Tli049fYRd4NMScViyrXrKqN0dIdE"
  private headers = new HttpHeaders()
  private isBrowser: Boolean = false;
  _httpClient = inject(HttpClient)

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAllBooks(): Observable <any> {
    // ! send token to header
    return this._httpClient.get(`assets/data.json`);
  }

  getSinglBook(bookId: string): Observable<any>{
    if (this.isBrowser) {
      this.headers = this.headers.set('token', this.token);
    }
    return this._httpClient.get(`${apiUrl}/book/${bookId}`,{headers: this.headers});
  }

  updateTheBook(bookId: string , body: any): Observable<any>{
    if (this.isBrowser) {
      // this.token = localStorage.getItem('token');
      if (this.token) {
        this.headers = this.headers.set('token', this.token);
      }
    }
    return this._httpClient.put(`${apiUrl}/book/${bookId}`, body ,{headers: this.headers});
  }


  deleteTheBook(bookId: string): Observable<any>{
    if (this.isBrowser) {
      // this.token = localStorage.getItem('token');
      if (this.token) {
        this.headers = this.headers.set('token', this.token);
      }
    }
    return this._httpClient.put(`${apiUrl}/books/${bookId}`, {headers: this.headers});
  }

}
