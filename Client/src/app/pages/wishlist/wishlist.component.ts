import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { GetWishlistService } from "../../services/wishlist/getWishlist.service";
import { AddToCartBtnComponent } from "../../components/add-to-cart-btn/add-to-cart-btn.component";
import { DeleteBookFromWishlistServiece } from "../../services/wishlist/deleteFromWishlist.service";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog/confirmation-dialog.component";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";

@Component({
  selector: "app-wishlist",
  standalone: true,
  templateUrl: "./wishlist.component.html",
  styleUrl: "./wishlist.component.scss",
  imports: [
    AddToCartBtnComponent,
    ConfirmationDialogComponent,
    SubNavbarComponent,
  ],
})
export class WishlistComponent implements OnInit {
  wishlistBooks: any[] = [];

  numOfWishlist: number = 0;
  showConfirmationDialog = false;
  bookIdToRemove: string = "";
  isLoading = true;

  constructor(
    private _getWishlist: GetWishlistService,
    private _deletFromWishlist: DeleteBookFromWishlistServiece,
    private router: Router
  ) {}

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
            this.wishlistBooks = res.data.books;
            this.numOfWishlist = this.wishlistBooks.length;
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
