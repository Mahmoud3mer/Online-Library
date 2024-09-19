import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from '../../util/apiUrl';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  isBrowser: boolean = false;
  private headers = new HttpHeaders()
  private token: any = "";

  constructor(private _httpClient: HttpClient ,@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.headers = this.headers.set('token', this.token.slice(1,this.token.length - 1)); 
        console.log(this.token);
        console.log(this.token.slice(1,this.token.length - 1));
      }
    }
  }


  getUser() : Observable <any> {
    return this._httpClient.get(`${apiUrl}/user-settings`,{headers: this.headers})
  }

  updateUser(body: FormData) : Observable <any> {
    return this._httpClient.patch(`${apiUrl}/user-settings/profile` ,body ,{headers: this.headers})
  }
  
}
