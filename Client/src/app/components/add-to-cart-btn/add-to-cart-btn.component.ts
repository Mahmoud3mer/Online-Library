import { Component, Input } from '@angular/core';
import { AddToCartServie } from '../../services/cart/AddToCart.service';
import { ToastService } from '../../services/Toast/toast.service';

@Component({
  selector: 'app-add-to-cart-btn',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart-btn.component.html',
  styleUrl: './add-to-cart-btn.component.scss'
})
export class AddToCartBtnComponent {
  constructor(
    private _addToCartService:AddToCartServie,
    private  _toastService: ToastService
  ){}
  @Input() bookId: string = '';


  addToCart(bookId:string){
    this._addToCartService.addToCart(bookId).subscribe(
    {
      next: (res) => {
        console.log(res);
        this._toastService.showSuccess(res.message);

        // const newCount = res.numOfCartItems;
        // this._cartCount.updateNumOfCartItems(newCount);
      },
      error: (err) => {
        console.log(err);

      },
      complete: () => {
        console.log("completed");
      }
    }
  )
  }

}


