import { Component, inject, Input, Output,  } from '@angular/core';
import { Router } from '@angular/router';
import { AddToCartBtnComponent } from "../add-to-cart-btn/add-to-cart-btn.component";
import { AddToWishlistBtnComponent } from "../add-to-wishlist-btn/add-to-wishlist-btn.component";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [AddToCartBtnComponent, AddToWishlistBtnComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {

  @Input() bookTitle : any = '';
  @Input() bookCategory : any = '';
  @Input() bookPrice : any = '';
  @Input() bookRating : any = 0 ;
  @Input() bookCoverImg : any = '';
  @Input() authorName : any = '';

  router = inject(Router);

  goToDetails(bookId:number){
    this.router.navigate(["book-details",bookId])
  }

}
