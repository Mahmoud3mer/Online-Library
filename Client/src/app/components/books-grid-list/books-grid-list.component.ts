import { Component, Input } from "@angular/core";
import { BookCardComponent } from "../book-card/book-card.component";
import { BookInterface } from "../../interfaces/books.interface";

@Component({
  selector: "app-books-grid-list",
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: "./books-grid-list.component.html",
  styleUrl: "./books-grid-list.component.scss",
})
export class BooksGridListComponent {
  @Input() allBooks: Array<BookInterface> = [];
}
