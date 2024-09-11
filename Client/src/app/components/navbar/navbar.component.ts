import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthourizationService } from '../../services/users/authourization.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLoggedIn = false;
  username: string = '';
  isDropdownOpen = false;

  currencies: string[] = ["$ USD","€ EURO","$ CAD","₹ INR","¥ CNY","৳ CNY"]
  languages: string[] = ["English","Español","Filipino","Français","العربية","हिन्दी"]
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
  }

  removeBookFromCart(itemToRemove: any){
    this.carts = this.carts.filter(item => item !== itemToRemove);
    this.calcTotalPrice();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  constructor(private _authorizationService: AuthourizationService) {
    this._authorizationService.loggedIn.subscribe((token) => {
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
          // this.username = storedUsername
          //   .split('')
          //   .slice(1, 3)
          //   .join('')
          //   .toUpperCase();
          this.username = storedUsername.slice(1, storedUsername.length - 1);
          console.log(this.username);
        } else {
          this.username = 'UNKNOWN';
        }
      } else {
        this.username = '';
      }
    });
  }

  logout() {
    this._authorizationService.logOut();
  }
}
