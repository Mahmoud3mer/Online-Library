import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { BookInterface, CategoryInterface } from '../../interfaces/books.interface';
import { AllBooksStreamOfBooksService } from '../../services/books/all-books-stream-of-books.service';
import { BooksCategoryService } from '../../services/books/books-category.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookCardComponent,SubNavbarComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {

  allBooks : Array<BookInterface> = [];
  categories : Array<CategoryInterface> = [];
  page: number = 1;
  constructor(
    private _allBooksStreamOfBooksService: AllBooksStreamOfBooksService,
    private _booksCategoryService: BooksCategoryService
  ) {}


  ngOnInit(): void {
    this.fetchAllBooks()
    this.getBooksByCategory()
  }

  fetchAllBooks(){
    this._allBooksStreamOfBooksService.getStreamOfBooks(this.page,5).subscribe({
      next: (res) => {
        this.allBooks = res.data;
        // console.log(res);

      },
      error: (err) => {
        console.log("Error" , err);

      },
      complete: () => {
        console.log("Got All Books From <<<< Books Page >>>>");

      }
    })
  }

  getBooksByCategory(){
    this._booksCategoryService.getBooksByCategory(this.page,5).subscribe({
      next: (res) => {
        this.categories = res.data;
        // console.log(res.data, "-----------------res.data");
        // console.log(this.page);
        // console.log(this.category);

      },
      error: (err)=> {
        console.log(err);
      },
      complete: () => {
        console.log("Got All Categories");

      }
    })
  }

}
