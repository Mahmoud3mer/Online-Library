import { Component, OnInit } from '@angular/core';
import { GetCartService } from '../../services/cart/GetCart.service';
import { UpdateCartQuantiy } from '../../services/cart/updateCartQuantiy.service';
import { DeleteBookFromCartService } from '../../services/cart/delete.service';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { AddToWishlistBtnComponent } from "../../components/add-to-wishlist-btn/add-to-wishlist-btn.component";
import { AddToCartBtnComponent } from "../../components/add-to-cart-btn/add-to-cart-btn.component";
import { ToastService } from '../../services/Toast/toast.service';
import { CartCountService } from '../../services/cart/CartCount.service';




@Component({
  standalone:true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl:'./cart.component.scss',
  imports: [
    CommonModule,
    ConfirmationDialogComponent,
    AddToWishlistBtnComponent,
    AddToCartBtnComponent
],
})
export class CartComponent implements OnInit {
  cartBooks:any[] = []
  numOfCartItems:number=0
  totalPrice:number=0;
  showConfirmationDialog = false;
  bookIdToRemove: string =''
  isLoading:boolean=true;
  constructor(private _getCartService:GetCartService,private _updatCartQuantity:UpdateCartQuantiy,
    private _deleteBookFromCart:DeleteBookFromCartService,
    private _toastService:ToastService,
    private _cartCount:CartCountService,
    private router:Router) { }

  ngOnInit(): void {
    this.getCart();
  }

    roundedPrice(): number {
    return Math.round(this.totalPrice);
  }

    // Fetch items from CartService
    getCart(){
      this._getCartService.getCart().subscribe(
        {
          next: (res) => {
            this.cartBooks=res.data.books;
            this.totalPrice=res.data.totalPrice
            console.log(res);

            this.numOfCartItems=res.data.numOfCartItems;
            console.log(this.cartBooks);
  
  
            // this._cartCount.updateNumOfCartItems(this.numOfCartItems);
  
  
          },
          error: (err) => {
            console.log(err);
  
          },
          complete: () => {
            console.log("get cart products");
            this.isLoading = false;
          }
        }
      )
    }
  //confirmation //
  openConfirmationDialog(bookId: string): void {
    this.bookIdToRemove = bookId;
    this.showConfirmationDialog = true;
  }


  handleConfirm(): void {
    if (this.bookIdToRemove) {
      this._deleteBookFromCart.deleteBookFormCart(this.bookIdToRemove).subscribe({
        next: (res) => {
          this.cartBooks = res.data.books;
          this.totalPrice = res.data.totalPrice;
          this._cartCount.updateNumOfCartItems(res.data.numOfCartItems)
          this._toastService.showSuccess('Book removed from cart successfully!');
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log("delete book successfully");
          this.showConfirmationDialog = false;
        }
      });
    }
  }

  handleCancel() {
    this.showConfirmationDialog = false;
  }




  updateCartItem(bookId: string, newCount: number) {
    if (newCount < 1) return;
    this._updatCartQuantity.updateCart(bookId, newCount).subscribe({
      next: (res) => {
        console.log(res);
        this._cartCount.updateNumOfCartItems(res.data.numOfCartItems)
        this.cartBooks= res.data.books
        this.totalPrice=res.data.totalPrice

      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  navigatToProducts(){
    this.router.navigate(['/books']);
  }

 


  // // Clear all items from the cart
  // clearCart(): void {
  //   this.cartService.clearCart();
  //   this.getCartItems();
  //   this.totalPrice = 0;
  // }
}
