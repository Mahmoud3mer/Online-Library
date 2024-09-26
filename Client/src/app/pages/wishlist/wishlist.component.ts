import { Component, OnInit } from "@angular/core";
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

  numOfWishlist: number = 0;
  showConfirmationDialog = false;
  bookIdToRemove: string = "";
  isLoading = true;

  constructor(
    private _getWishlist: GetWishlistService,
    private _deletFromWishlist: DeleteBookFromWishlistServiece,
    private _wishlistCount:WishListCountService,
    private _toastService:ToastService,
    private router: Router,
    private _myTranslateService:MyTranslateService
  ) {}

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }


  ngOnInit(): void {
    this.getWishList();
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
            this._wishlistCount.updateNumOfWishItems(this.numOfWishlist)
            this._toastService.showSuccess('Book removed from wishlist successfully!');
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
    console.log("get");

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
