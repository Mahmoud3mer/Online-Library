import { Component, Input } from '@angular/core';
import { BooksCardForListComponent } from "../books-card-for-list/books-card-for-list.component";
import { BookInterface } from '../../interfaces/books.interface';
import { PaginationComponent } from "../pagination/pagination.component";

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [BooksCardForListComponent, PaginationComponent],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss'
})
export class BooksListComponent {
  @Input() allBooks : Array<BookInterface> = [];

}
