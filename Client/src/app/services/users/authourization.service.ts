import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthourizationService {
  httpClient = inject(HttpClient);
  router = inject(Router);
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isBrowser: boolean;
  token: string = '';
  userName: string = '';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token = JSON.parse(storedToken);
        this.loggedIn.next(true);
      }
      const storedUserName = localStorage.getItem('username');
      if (storedUserName) {
        this.userName = JSON.parse(storedUserName);
      }
    }
  }

  signUp(data: any): Observable<any> {
    return this.httpClient.post(`${apiUrl}/signup`, data);
  }

  signIn(data: any): Observable<any> {
    return this.httpClient.post(`${apiUrl}/signin`, data);
  }

  verifyGoogleToken(token: string): Observable<any> {
    return this.httpClient.post(`${apiUrl}/signup/verify-token`, { token });
  }

  saveUserToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('token', JSON.stringify(token));
      // localStorage.setItem('username', JSON.stringify(username));
      this.loggedIn.next(true);
    }
  }

  logOut() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.loggedIn.next(false);
      this.router.navigate(['/signin']);
    }
  }

  setLoggedIn(status: boolean): void {
    this.loggedInSubject.next(status);
  }
}
