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
  //! for testcode (will retrieve from localstorag
  private token : any = ''
  private headers = new HttpHeaders()
  private isBrowser: Boolean = false;
  _httpClient = inject(HttpClient)

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
      this.token = localStorage.getItem('token')
    }
  }

  getAllBooks(): Observable <any> {
    // ! send token to header
    return this._httpClient.get(`${apiUrl}/books`);
  }

  getSinglBook(bookId: string): Observable<any>{
    if (this.isBrowser) {
      this.headers = this.headers.set('token', this.token);
    }
    return this._httpClient.get(`${apiUrl}/books/${bookId}`,{headers: this.headers});
  }

  updateTheBook(bookId: string , body: any): Observable<any>{
    if (this.isBrowser) {
      if (this.token) {
        this.headers = this.headers.set('token', this.token);
      }
    }
    return this._httpClient.patch(`${apiUrl}/books/${bookId}`, body ,{headers: this.headers});
  }


  deleteTheBook(bookId: string): Observable<any>{
    if (this.token) {
      this.headers = this.headers.set('token', this.token);
    }
    return this._httpClient.put(`${apiUrl}/books/${bookId}`, {headers: this.headers});
  }

}
