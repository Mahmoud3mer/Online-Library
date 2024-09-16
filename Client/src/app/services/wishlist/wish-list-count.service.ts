import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListCountService {

  private wishlistCount = new BehaviorSubject<number>(0);
  private isBrowser: boolean = false;
  wishlistCount$ = this.wishlistCount.asObservable();
 
   constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
          const storedWishListcount = localStorage.getItem('wishListCount');
          const initialCount = storedWishListcount ? parseInt(storedWishListcount, 10) : 0;
  
          this.updateNumOfWishItems (initialCount)
      }
  }


  updateNumOfWishItems (newCount:number){
    if (this.isBrowser) {
    localStorage.setItem('wishListCount',newCount.toString())}
    this.wishlistCount.next(newCount);
  }

}
