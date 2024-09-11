import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-navbar',
  standalone: true,
  imports: [],
  templateUrl: './sub-navbar.component.html',
  styleUrl: './sub-navbar.component.scss'
})
export class SubNavbarComponent {
  router = inject(Router)
  carts: any[] = [
    {
      title: "Apple Watch Series 6",
      image:"assets/images/header/cart-items/item1.jpg",
      price: 99.00,
      stock: 3
    },
    {
      title: "Apple Watch Series 6",
      image:"assets/images/header/cart-items/item1.jpg",
      price: 99.00,
      stock: 1
    }
  ]

  totalPrice: number = 0;
  totalItems: number = 0;

  constructor(){
    this.calcTotalPrice()
  }

  goToWishlistPage(){
    this.router.navigate(["/wishlist"])
  }

  calcTotalPrice(){
    this.totalPrice = 0;
    // for (let i = 0; i < this.carts.length; i++) {
    //   let stoks = this.carts[i].stock;
    //   for (let j = 0; j < stoks; j++) {
    //     this.totalPrice += this.carts[i].price;
    //   }
    // }

    this.totalPrice = this.carts.reduce((total, item) => total + (item.price * item.stock), 0);
    this.totalItems = this.carts.reduce((total, item) => total + (item.stock), 0);
  }

  removeBookFromCart(itemToRemove: any){
    this.carts = this.carts.filter(item => item !== itemToRemove);
    this.calcTotalPrice();
  }
}
