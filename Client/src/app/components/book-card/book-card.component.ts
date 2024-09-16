import { Component, inject, Input, OnChanges, SimpleChanges,  } from '@angular/core';
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
export class BookCardComponent implements OnChanges {
  @Input() bookId : string = '';
  @Input() bookTitle: string = '';
  @Input() bookCategory: string = '';
  @Input() bookPrice: number = 0;
  @Input() bookCoverImg: string = '';
  @Input() authorName: string = '';
  @Input() bookRating: number = 0;

// <<<<<<< User-Settings1
//   @Input() bookTitle : any = '';
//   @Input() bookCategory : any = '';
//   @Input() bookPrice : any = '';
//   @Input() bookRating : any = 0 ;
//   @Input() bookCoverImg : any = '';
//   @Input() authorName : any = '';
//   @Input() bookId : any = '';

  router = inject(Router);

  goToDetails(){
    this.router.navigate(["book-details",this.bookId])
// =======
  starArray: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookRating']) {
      this.updateStarArray();
    }
  }

  updateStarArray(): void {
    const fullStars = Math.floor(this.bookRating);
    const halfStar = this.bookRating % 1 !== 0;

    this.starArray = Array(fullStars).fill(1);
    if (halfStar) {
      this.starArray.push(0.5);
    }
    const emptyStars = 5 - this.starArray.length;
    this.starArray.push(...Array(emptyStars).fill(0));
  }

  router = inject(Router);

  goToDetails(bookId:string){
    this.router.navigate(["book-details",bookId])
// >>>>>>> master
  }

}
