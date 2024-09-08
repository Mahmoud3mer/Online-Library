import { Component, Input } from '@angular/core';
import { AddToCartServie } from '../../services/cart/AddToCart.service';

@Component({
  selector: 'app-add-to-cart-btn',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart-btn.component.html',
  styleUrl: './add-to-cart-btn.component.scss'
})
export class AddToCartBtnComponent {
  constructor(private _addToCartService:AddToCartServie){}
  @Input() itemId: string = '';


  addToCart(prodId:string){
    this._addToCartService.addToCart(prodId).subscribe(
    {
      next: (res) => {
        console.log(res);

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


