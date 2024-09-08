// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartCountService {
//   private cartCount = new BehaviorSubject<number>(0);

//   cartCount$ = this.cartCount.asObservable();

//   constructor() {}

//   updateNumOfCartItems(newCount:number){
//     localStorage.setItem('numOfCartItems',newCount.toString())
//     this.cartCount.next(newCount);
//   }

// }

