import { Component, Input, Output,  } from '@angular/core';

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
}
