import { Component, inject, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartCountService } from "../../../services/cart/CartCount.service";
import { WishListCountService } from "../../../services/wishlist/wish-list-count.service";
import { GetCartService } from "../../../services/cart/GetCart.service";
import { CartBooksService } from "../../../services/cart/cart-books.service";
import { MyTranslateService } from "../../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";


@Component({
  selector: "app-sub-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: "./sub-navbar.component.html",
  styleUrl: "./sub-navbar.component.scss",
})
export class SubNavbarComponent implements OnInit {
  numOfCartItems: number = 0;
  numOfWishlistItems: number = 0;
  cartBooks: any[] = [];

  constructor(
    private _cartCountService: CartCountService,
    private _wishlistCount: WishListCountService,
    private _cartBooksService: CartBooksService,
    private _myTranslateService:MyTranslateService,
  ) {}

  ngOnInit(): void {
    this._cartCountService.cartCount$.subscribe((count) => {
      this.numOfCartItems = count;
    });
    this._wishlistCount.wishlistCount$.subscribe((count) => {
      this.numOfWishlistItems = count;
    });
    this._cartBooksService.cartBooks$.subscribe((books) => {
      this.cartBooks = books;  
    });
    
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
  
}
