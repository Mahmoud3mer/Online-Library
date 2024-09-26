import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { apiUrl } from "../../util/apiUrl";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { WishlistBookService } from "../wishlist/wishlist-books.service";
import { CartBooksService } from "../cart/cart-books.service";
import { WishListCountService } from "../wishlist/wish-list-count.service";
import { CartCountService } from "../cart/CartCount.service";

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

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _cartbooks: CartBooksService,
    private _wishlistBooks: WishlistBookService,
    private _wishlistCount:WishListCountService,
    private _cartCount:CartCountService
  ) {
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
      this._cartCount.clearNumOfCartItems();
      this._wishlistCount.clearWishlistCount();
      this._cartbooks.clearCartBooks();
      this._wishlistBooks.clearWishlistBooks();
      this.loggedInUser.next("");
      this.router.navigate(["/signin"]);
    }
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.httpClient.post(`${apiUrl}/signin/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}/signin/reset-password`,
      { password },
      { params: { token } }
    );
  }
}
