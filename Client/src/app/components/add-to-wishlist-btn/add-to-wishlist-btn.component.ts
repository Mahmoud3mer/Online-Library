import { Component, Input } from '@angular/core';
import { AddToWishListService } from '../../services/wishlist/addToWishlist.service';

@Component({
  selector: 'app-add-to-wishlist-btn',
  standalone: true,
  imports: [],
  templateUrl: './add-to-wishlist-btn.component.html',
  styleUrl: './add-to-wishlist-btn.component.scss'
})
export class AddToWishlistBtnComponent {
  constructor(private _addToWishList:AddToWishListService){}
  @Input() bookId: string = '';


  addToWishlist(bookId:string){
    console.log(bookId);

    this._addToWishList.addToWishList(bookId).subscribe(
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
