import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { isPlatformBrowser, JsonPipe } from "@angular/common";
import { apiUrl } from "../../util/apiUrl";

@Injectable({
  providedIn: "root",
})
export class GetCartService {
  private myApi = `${apiUrl}/carts`;
  private isBrowser: Boolean = false;
  private userToken: string | null = null;
  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getCart(): Observable<any> {
    let headers = new HttpHeaders();

    if (this.isBrowser) {
      const token = localStorage.getItem("token");

      this.userToken = token ? JSON.parse(token) : null;

      if (this.userToken) {
        headers = headers.set("token", this.userToken);
      }
    }

    return this._httpClient.get<any>(this.myApi, { headers });
  }
}
