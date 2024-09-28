import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";

import { GetWishlistService } from "../../services/wishlist/getWishlist.service";
import { AddToCartBtnComponent } from "../../components/add-to-cart-btn/add-to-cart-btn.component";
import { DeleteBookFromWishlistServiece } from "../../services/wishlist/deleteFromWishlist.service";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog/confirmation-dialog.component";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { ToastService } from "../../services/Toast/toast.service";
import { WishListCountService } from "../../services/wishlist/wish-list-count.service";
import { TranslateModule } from "@ngx-translate/core";
import { BookInterface } from "../../interfaces/books.interface";
import { WishlistBookService } from "../../services/wishlist/wishlist-books.service";
import { isPlatformBrowser } from "@angular/common";
import { MyTranslateService } from "../../services/translation/my-translate.service";

@Component({
  selector: "app-wishlist",
  standalone: true,
  templateUrl: "./wishlist.component.html",
  styleUrl: "./wishlist.component.scss",
  imports: [
    AddToCartBtnComponent,
    ConfirmationDialogComponent,
    SubNavbarComponent, TranslateModule
  ],
})
export class WishlistComponent implements OnInit {
  wishlistBooks: BookInterface[] = [];
  private isBrowser: Boolean = false;
  numOfWishlist: number = 0;
  showConfirmationDialog = false;
  bookIdToRemove: string = "";
  isLoading = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _getWishlist: GetWishlistService,
    private _deletFromWishlist: DeleteBookFromWishlistServiece,
    private _wishlistCount:WishListCountService,
    private _wishlistBooks:WishlistBookService,
    private _toastService:ToastService,
    private router: Router,
    private _myTranslateService:MyTranslateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }


  ngOnInit(): void {
    if(this.isBrowser){
      this.getWishList();
    }
  }
  //rating stars
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
  //confirmation
  openConfirmationDialog(bookId: string): void {
    this.bookIdToRemove = bookId;
    this.showConfirmationDialog = true;
  }

  handleConfirm(): void {
    if (this.bookIdToRemove) {
      this._deletFromWishlist
        .deleteFromWihslist(this.bookIdToRemove)
        .subscribe({
          next: (res) => {
            console.log(res.data.books);

            this.wishlistBooks = res.data.books;
            this.numOfWishlist = this.wishlistBooks.length;
            this._wishlistBooks.updateWishlistBooks(this.wishlistBooks)
            this._wishlistCount.updateNumOfWishItems(this.numOfWishlist)
            if (localStorage.getItem('lang') === 'en') {
              this._toastService.showSuccess('Book removed from wishlist successfully!');
            } else {
              this._toastService.showSuccess('تمت إزالة الكتاب من المفضلة بنجاح!');
            }
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
  }

  handleCancel() {
    this.showConfirmationDialog = false;
  }

  getWishList() {
 
      const token = localStorage.getItem("token");
      if (!token) {
        this._toastService.showError("Please log in to view your cart.");
        this.router.navigate(['/signin']);  // Redirect to login page
        this.isLoading = false;
        return;
      }
      
 

    this._getWishlist.getWishlist().subscribe({
      next: (res) => {
        this.wishlistBooks = res.data.books;

        this.numOfWishlist = this.wishlistBooks.length;
        this.isLoading = false;
        console.log(res);
      },
      error: (err) => {
        console.log(err, "err get wish list prodcuts");
        this.isLoading = false;
      },
      complete: () => {
        console.log("get wish list  books");
      },
    });
  }

  navigatToProducts() {
    this.router.navigate(["/books"]);
  }
}
