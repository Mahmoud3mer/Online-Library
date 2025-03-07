import { Component, Inject, Input, PLATFORM_ID } from "@angular/core";
import { AddToCartServie } from "../../services/cart/AddToCart.service";
import { ToastService } from "../../services/Toast/toast.service";
import { CartCountService } from "../../services/cart/CartCount.service";
import { isPlatformBrowser } from "@angular/common";
import { CartBooksService } from "../../services/cart/cart-books.service";

@Component({
  selector: "app-add-to-cart-btn",
  standalone: true,
  imports: [],
  templateUrl: "./add-to-cart-btn.component.html",
  styleUrl: "./add-to-cart-btn.component.scss",
})
export class AddToCartBtnComponent {
  private isBrowser: boolean = false;

  message: string = "";
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _addToCartService: AddToCartServie,
    private _toastService: ToastService,
    private _cartCount: CartCountService,
    private _cartBooksService: CartBooksService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  @Input() bookId: string = "";
  @Input() stock!: number;
  addToCart(bookId: string) {
    console.log(bookId);
    if (this.isBrowser) {
      const token = localStorage.getItem("token");
      if (!token) {
        this._toastService.showError("You need to log in first.");
        return;
      }
    }

    // Check if the book is out of stock
    if (this.stock == 0) {
      this._toastService.showError("Book is out of stock.");
      return;
    }
    
    this._addToCartService.addToCart(bookId).subscribe({
      next: (res) => {
        console.log(res);


        if (localStorage.getItem("lang") === "en") {
          if (res.message === "Book is already in the cart") {
            this.message = "This book is already in your cart.";
            this._toastService.showError(this.message);
          } else if (res.message === "Book added to cart successfully") {
            this._cartCount.updateNumOfCartItems(res.data.numOfCartItems);
            this.message = "Book added to cart successfully!";
            this._toastService.showSuccess(this.message);
            this._cartBooksService.updateCartBooks(res.data.books);
          }
        } else if (localStorage.getItem("lang") === "ar") {
          if (res.message === "Book is already in the cart") {
            this.message = "هذا الكتاب موجود بالفعل";

            this._toastService.showError(this.message);
          } else if (res.message === "Book added to cart successfully") {
            this._cartCount.updateNumOfCartItems(res.data.numOfCartItems);
            this.message = "تم اضافة الكتاب الي السلة بنجاح";
            this._toastService.showSuccess(this.message);
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.message = err;
      },
      complete: () => {
        console.log("completed");
        console.log(this.message);
      },
    });
  }
}
