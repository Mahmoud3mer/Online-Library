import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { apiUrl } from '../../util/apiUrl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClearCartService {
  private myApi = `${apiUrl}/carts/clear`;
  private isBrowser: boolean = false;
  private userToken = '';

  constructor(private _httpClient: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  clearCart(): Observable<any> {
    let headers = new HttpHeaders();

    if (this.isBrowser) {
       
      const token = localStorage.getItem('token');
      
      
      this.userToken = token ? JSON.parse(token) : null;

      if (this.userToken) {
        headers = headers.set('token', this.userToken);
      }
    }



    return this._httpClient.delete<any>(this.myApi, { headers })
  }
}
