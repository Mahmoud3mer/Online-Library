
import { Component, Inject, Input, OnInit, PLATFORM_ID } from "@angular/core";
import { ToastService } from "../../services/Toast/toast.service";
import { AddToWishListService } from "../../services/wishlist/addToWishlist.service";
import { DeleteBookFromWishlistServiece } from "../../services/wishlist/deleteFromWishlist.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { BookInterface } from "./../../interfaces/books.interface";
import { WishListCountService } from "../../services/wishlist/wish-list-count.service";
import { WishlistBookService } from "../../services/wishlist/wishlist-books.service";

@Component({
  standalone: true,
  selector: "app-add-to-wishlist-btn",
  templateUrl: "./add-to-wishlist-btn.component.html",
  styleUrls: ["./add-to-wishlist-btn.component.scss"],
  imports: [CommonModule],
})

export class AddToWishlistBtnComponent implements OnInit {
  @Input() bookId: string = "";
  isWishlisted: boolean = false;
  private isBrowser: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _bookWishlistService: WishlistBookService,
    private _addToWishListService: AddToWishListService,
    private _deleteFromWishlistService: DeleteBookFromWishlistServiece,
    private _numOfWishlist: WishListCountService,
    private _toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.checkIfWishlisted();
  }


  checkIfWishlisted(): void {
    // if (this.isBrowser) {
    //   const token = localStorage.getItem("token");
    //   if (!token) return;

    // }

    this.isWishlisted = this._bookWishlistService.isBookWishlisted(this.bookId);
  }

  toggleWishlist(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem("token");
      if (!token) {
        this._toastService.showError("You need to log in first.");
        return;
      }
    }

    if (this.isWishlisted) {
      this._deleteFromWishlistService
        .deleteFromWihslist(this.bookId)
        .subscribe({
          next: (res) => {
            this.isWishlisted = false;
            this._numOfWishlist.updateNumOfWishItems(res.data.books.length)
            this._bookWishlistService.updateWishlistBooks(res.data.books)

            if (localStorage.getItem('lang') === 'en') {
              this._toastService.showSuccess("Removed from wishlist.");
            }
            else {
              this._toastService.showSuccess("تمت الازالة من المفضلة");
            }
          }

          ,
          error: (err) => console.log(err),
        });

    }
    else {
      this._addToWishListService.addToWishList(this.bookId).subscribe({
        next: (res) => {
          console.log(res);
          this.isWishlisted = true;
          this._numOfWishlist.updateNumOfWishItems(res.data.books.length)
          this._bookWishlistService.updateWishlistBooks(res.data.books)
          if (localStorage.getItem('lang') === 'en') {
            this._toastService.showSuccess("Added To wishlist Succefully.");
          }
          else {
            this._toastService.showSuccess("تمت الإضافة الي المفضلة");
          }
        },
        error: (err) => console.log(err),
      });
    }
  }
}