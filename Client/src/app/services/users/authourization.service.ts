import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { apiUrl } from "../../util/apiUrl";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthourizationService {
  httpClient = inject(HttpClient);
  router = inject(Router);
  isBrowser: boolean;
  token: string = "";
  userName: string = "";
  loggedInUser: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        this.loggedInUser.next(storedToken);
      }

      const storedUserName = localStorage.getItem("username");
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

  saveUserToken(token: string, username?: string) {
    if (this.isBrowser) {
      localStorage.setItem("token", JSON.stringify(token));
      this.loggedInUser.next(token);
      if (username) {
        localStorage.setItem("username", JSON.stringify(username));
        this.userName = username;
      }
    }
  }

  logOut() {
    if (this.isBrowser) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.loggedInUser.next("");
      this.router.navigate(["/signin"]);
    }
  }
}
