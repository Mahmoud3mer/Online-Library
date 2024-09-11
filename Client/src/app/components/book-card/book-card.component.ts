import { Component, inject, Input, Output,  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [],
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
