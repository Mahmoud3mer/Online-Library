import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartCountService } from '../../../services/cart/CartCount.service';
import { WishListCountService } from '../../../services/wishlist/wish-list-count.service';

@Component({
  selector: 'app-sub-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sub-navbar.component.html',
  styleUrl: './sub-navbar.component.scss'
})
export class SubNavbarComponent implements OnInit{
  numOfCartItems: number = 0;  
  numOfWishlistItems:number=0;
  constructor(private _cartCountService:CartCountService,private _wishlistCount:WishListCountService){
    this.calcTotalPrice()
    
  }

  ngOnInit(): void { 
    this._cartCountService.cartCount$.subscribe(count => {
      this.numOfCartItems = count;
    });
    this._wishlistCount.wishlistCount$.subscribe(count=>{
       this.numOfWishlistItems=count;
    })
  }

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
