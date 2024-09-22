
import { Component, Inject, Input, OnInit, PLATFORM_ID } from "@angular/core";
import { ToastService } from "../../services/Toast/toast.service";
import { GetWishlistService } from "../../services/wishlist/getWishlist.service";
import { AddToWishListService } from "../../services/wishlist/addToWishlist.service";
import { DeleteBookFromWishlistServiece } from "../../services/wishlist/deleteFromWishlist.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { BookInterface } from "./../../interfaces/books.interface";
import { WishListCountService } from "../../services/wishlist/wish-list-count.service";

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
    private _getWishlistService: GetWishlistService,
    private _addToWishListService: AddToWishListService,
    private _deleteFromWishlistService: DeleteBookFromWishlistServiece,
    private _numOfWishlist:WishListCountService,
    private _toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.checkIfWishlisted();
  }


  checkIfWishlisted(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem("token");
      if (!token) return;
  
    }

    this._getWishlistService.getWishlist().subscribe({
      next: (response) => {
        const wishlistedBooks = response.data.books.map(
          (book: BookInterface) => book._id
        );
        this.isWishlisted = wishlistedBooks.includes(this.bookId);
      },
      error: (err) => console.log(err),
    });
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

          if(document.dir==='ltr'){
            this._toastService.showSuccess("Removed from wishlist.");
          }
          else{
            this._toastService.showSuccess("تمت الازالة من المفضلة");
          }}
          
          ,
          error: (err) => console.log(err),
        });
    } else {
      this._addToWishListService.addToWishList(this.bookId).subscribe({
        next: (res) => {
          console.log(res);
          this.isWishlisted = true;
          this._numOfWishlist.updateNumOfWishItems(res.data.books.length)
          if(document.dir==='ltr'){
            this._toastService.showSuccess("Added to wishlist.");
          }
        else{
          this._toastService.showSuccess("تمت الاضافة الي المفضلة ");
        }
        }
        ,
        error: (err) => console.log(err),
      });
    }
  }
}
