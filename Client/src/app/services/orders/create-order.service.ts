import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { apiUrl } from "../../util/apiUrl";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CreateOrderService {
  private myApi = `${apiUrl}/orders`;
  private isBrowser: boolean = false;
  private userToken = "";
  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  createOrder(body: any): Observable<any> {
    let headers = new HttpHeaders();

    if (this.isBrowser) {
      const token = localStorage.getItem("token");

      this.userToken = token ? JSON.parse(token) : null;

      if (this.userToken) {
        headers = headers.set("token", this.userToken);
      }
    }

    return this._httpClient.post<any>(this.myApi, body, { headers });
  }
}
