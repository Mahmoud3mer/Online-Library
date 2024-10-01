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
import { SpinnerComponent } from "../../components/spinner/spinner.component";
import { ClearWishlistService } from "../../services/wishlist/clear-wishlist.service";

@Component({
  selector: "app-wishlist",
  standalone: true,
  templateUrl: "./wishlist.component.html",
  styleUrl: "./wishlist.component.scss",
  imports: [
    AddToCartBtnComponent,
    ConfirmationDialogComponent,
    SubNavbarComponent, TranslateModule,
    SpinnerComponent
],
})
export class WishlistComponent implements OnInit {
  wishlistBooks: BookInterface[] = [];
  private isBrowser: Boolean = false;
  numOfWishlist: number = 0;
  showConfirmationDialog = false;
  bookIdToRemove: string = "";
  isLoading = true;
 
   
  confirmMsg: string =
    "are you sure you want to delete this book from your wishlist";
  confirmText: string = "delete";
  clearWishlistMode = false;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _getWishlist: GetWishlistService,
    private _deletFromWishlist: DeleteBookFromWishlistServiece,
    private _wishlistCount:WishListCountService,
    private _wishlistBooks:WishlistBookService,
    private _toastService:ToastService,
    private router: Router,
    private _myTranslateService:MyTranslateService,
    private _clearWishlistService:ClearWishlistService
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
  //clear
  
  clearWishlist(): void {
    this._clearWishlistService.clearWishlist().subscribe({
      next: (res) => {
        this.wishlistBooks = res.data.books;
        console.log(res);
        this._wishlistBooks.clearWishlistBooks();
        this._toastService.showSuccess("wishlist cleared successfully!"); 
        this._wishlistCount.clearWishlistCount()
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.showConfirmationDialog = false;
        console.log("wishlist cleared successfully");
      }
    });
  }
  //confirmation
  openConfirmationDialog(bookId: string): void {
    this.bookIdToRemove = bookId;
    this.confirmMsg =
      "are you sure you want to delete this book from your wishlist";
    this.confirmText = "delete";
    this.clearWishlistMode = false; // Ensure clearWishlist is false
    this.showConfirmationDialog = true;
  }

  openClearCartConfirmation(): void {
    this.clearWishlistMode = true; // Set clearCartMode to true
    this.confirmMsg = "Are you sure you want to clear your wishlist?";
    this.confirmText = "clear wishlist";
    this.showConfirmationDialog = true;  
  }
  deletBookFromWishlist(): void {
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
  handleConfirm(): void {
    if (this.clearWishlistMode) {
      this.clearWishlist(); // Call the clear cart method
    } else if  (this.bookIdToRemove) {
        this.deletBookFromWishlist(); // Delete specific book
      }
    
  }

  handleCancel() {
    this.showConfirmationDialog = false;
    this.clearWishlistMode = false;
    this.bookIdToRemove = "";
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


     //for long description
     getShortDescription(description: string): string {
      const maxLength = 80;  
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
      } else {
        return description;
      }
    }

    //go to details
    goToDetails(bookId: string) {
      this.router.navigate(["book-details", bookId])
    }
}
