import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class GetWishlistService {

  private myApi = `${apiUrl}/wishlist`;
  private isBrowser: Boolean = false;
  private userToken = '';
  constructor(private _httpClient: HttpClient,@Inject(PLATFORM_ID) platformId: object ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getWishlist(): Observable<any> {
    let headers = new HttpHeaders();

    if (this.isBrowser) {
      this.userToken = localStorage.getItem('token') || '';

      if (this.userToken) {
        headers = headers.set('token',this.userToken);
      }
    }

    return this._httpClient.get<any>(this.myApi, { headers });
}
}
