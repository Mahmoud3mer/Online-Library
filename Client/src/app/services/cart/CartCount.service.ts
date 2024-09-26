import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartCountService {
  private cartCount = new BehaviorSubject<number>(0);
  private isBrowser: boolean = false;
  cartCount$ = this.cartCount.asObservable();
  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedCartCount = localStorage.getItem("numOfCartItems");
      const initialCount = storedCartCount ? parseInt(storedCartCount, 10) : 0;

      this.updateNumOfCartItems(initialCount);
    }
  }

  setCartCount(count: number): void {
    this.cartCount.next(count);
  }

  updateNumOfCartItems(newCount: number) {
    if (this.isBrowser) {
      localStorage.setItem("numOfCartItems", newCount.toString());
    }
    this.cartCount.next(newCount);
  }

  clearNumOfCartItems(): void {
    if (this.isBrowser) {
      localStorage.removeItem('numOfCartItems');
    }
    this.cartCount.next(0);
  }

}
