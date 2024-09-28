import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
} from "@angular/core";
import { GetCartService } from "../../services/cart/GetCart.service";
import { UpdateCartQuantiy } from "../../services/cart/updateCartQuantiy.service";
import { DeleteBookFromCartService } from "../../services/cart/delete.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog/confirmation-dialog.component";
import { Router, RouterLink } from "@angular/router";
import { AddToWishlistBtnComponent } from "../../components/add-to-wishlist-btn/add-to-wishlist-btn.component";
import { AddToCartBtnComponent } from "../../components/add-to-cart-btn/add-to-cart-btn.component";
import { ToastService } from "../../services/Toast/toast.service";
import { CartCountService } from "../../services/cart/CartCount.service";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { CartBooksService } from "../../services/cart/cart-books.service";
import { ClearCartService } from "../../services/cart/clear-cart.service";
import { TranslateModule } from "@ngx-translate/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
@Component({
  standalone: true,
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
  imports: [
    CommonModule,
    ConfirmationDialogComponent,
    AddToCartBtnComponent,
    AddToWishlistBtnComponent,
    SubNavbarComponent,
    RouterLink,
    TranslateModule,
  ],
})
export class CartComponent implements OnInit {
  private isBrowser: Boolean = false;
  cartBooks: any[] = [];
  numOfCartItems: number = 0;
  subtotal: number = 0;
  shippingCost: number = 0;
  totalOrder: number = 0;
  showConfirmationDialog = false;
  bookIdToRemove: string = "";
  isLoading: boolean = true;
  confirmMsg: string =
    "are you sure you want to delete this book from your cart";
  confirmText: string = "delete";
  clearCartMode = false;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _getCartService: GetCartService,
    private _updatCartQuantity: UpdateCartQuantiy,
    private _deleteBookFromCart: DeleteBookFromCartService,
    private _toastService: ToastService,
    private _cartCount: CartCountService,
    private _cartBooksService: CartBooksService,
    private _clearCartService: ClearCartService,
    private router: Router,
    private _myTranslateService: MyTranslateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.getCart();
    }
  }

  starArray: number[] = [];

  updateStarArray(rating: number): void {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    this.starArray = Array(fullStars).fill(1);
    if (halfStar) {
      this.starArray.push(0.5);
    }
    const emptyStars = 5 - this.starArray.length;
    this.starArray.push(...Array(emptyStars).fill(0));
  }
  // Fetch items from CartService
  getCart() {
    if (this.isBrowser) {
      const token = localStorage.getItem("token");
      if (!token) {
        this._toastService.showError("Please log in to view your wishlist.");
        this.router.navigate(["/signin"]); // Redirect to login page
        this.isLoading = false;
        return;
      }
    }

    this._getCartService.getCart().subscribe({
      next: (res) => {
        console.log("res.....", res);

        this.cartBooks = res.data.books;
        this.subtotal = res.data.subtotal;
        this.shippingCost = res.data.shippingCost;
        this.totalOrder = res.data.totalOrder;
        this.numOfCartItems = res.data.numOfCartItems;
      },
      error: (err) => {
        console.log("errororro", err);
        this.isLoading = false;
      },
      complete: () => {
        console.log("get cart products");
        this.isLoading = false;
      },
    });
  }
  //confirmation //
  openConfirmationDialog(bookId: string): void {
    this.bookIdToRemove = bookId;
    this.confirmMsg =
      "are you sure you want to delete this book from your cart";
    this.confirmText = "delete";
    this.clearCartMode = false; // Ensure clearCartMode is false
    this.showConfirmationDialog = true;
  }

  openClearCartConfirmation(): void {
    this.clearCartMode = true; // Set clearCartMode to true
    this.confirmMsg = "Are you sure you want to clear your cart?";
    this.confirmText = "clear cart";
    this.showConfirmationDialog = true;
  }

  deleteBookFromCart(): void {
    this._deleteBookFromCart.deleteBookFormCart(this.bookIdToRemove).subscribe({
      next: (res) => {
        this.cartBooks = res.data.books;
        this.subtotal = res.data.subtotal;
        this.shippingCost = res.data.shippingCost;
        this.totalOrder = res.data.totalOrder;
        console.log(this.subtotal);
        console.log(this.shippingCost);
        console.log(this.totalOrder);

        this._cartCount.updateNumOfCartItems(res.data.numOfCartItems);
        this._cartBooksService.updateCartBooks(res.data.books);
        this._toastService.showSuccess("Book removed from cart successfully!");
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log("delete book successfully");
        this.showConfirmationDialog = false;
      },
    });
  }

  clearCart(): void {
    this._clearCartService.clearCart().subscribe({
      next: (res) => {
        this.cartBooks = res.data.books;
        this.subtotal = res.data.subtotal;
        this.shippingCost = res.data.shippingCost;
        this.totalOrder = res.data.totalOrder;
        console.log(res);

        this.numOfCartItems = 0;
        this._cartCount.updateNumOfCartItems(0); // Update cart count to 0
        this._cartBooksService.updateCartBooks([]);
        this._toastService.showSuccess("Cart cleared successfully!");
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.showConfirmationDialog = false;
        console.log("Cart cleared successfully");
      },
    });
  }

  handleConfirm(): void {
    if (this.clearCartMode) {
      this.clearCart(); // Call the clear cart method
    } else {
      if (this.bookIdToRemove) {
        this.deleteBookFromCart(); // Delete specific book
      }
    }
  }

  handleCancel() {
    this.showConfirmationDialog = false;
    this.clearCartMode = false;
    this.bookIdToRemove = "";
  }

  updateCartItem(bookId: string, newCount: number) {
    if (newCount < 1) return;
    this._updatCartQuantity.updateCart(bookId, newCount).subscribe({
      next: (res) => {
        console.log(res);
        this._cartCount.updateNumOfCartItems(res.data.numOfCartItems);
        this.cartBooks = res.data.books;
        this.subtotal = res.data.subtotal;
        this.shippingCost = res.data.shippingCost;
        this.totalOrder = res.data.totalOrder;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  navigatToProducts() {
    this.router.navigate(["/books"]);
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

  isCartEmpty(): boolean {
    return this.cartBooks.length === 0;
  }
  navigateToPayment(event: Event): void {
    if (this.isCartEmpty()) {
      event.preventDefault(); // Prevent the default link action
      this._toastService.showError(
        "Your cart is empty. Please add items before checking out."
      );
    } else {
      // Allow navigation if the cart is not empty
      this.router.navigate(["/payment"]);
    }
  }
}
