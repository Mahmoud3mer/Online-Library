import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookInterface } from '../../interfaces/books.interface';
import { AllBooksStreamOfBooksService } from '../../services/books/all-books-stream-of-books.service';
import { BooksCategoryService } from '../../services/books/books-category.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {

  allBooks : Array<BookInterface> = [];
  page: number = 1;
  constructor(
    private _allBooksStreamOfBooksService: AllBooksStreamOfBooksService,
    private _booksCategoryService: BooksCategoryService
  ) {}
  // loopTest = [
  //   {
  //     bookTitle: "The Great Gatsby",
  //     bookCoverImg: "https://i0.wp.com/americanwritersmuseum.org/wp-content/uploads/2018/02/CK-3.jpg?resize=267%2C400&ssl=1",
  //     bookCategory: "Fiction",
  //     bookPrice: 19.99,
  //     authorName: "F. Scott Fitzgerald",
  //     bookRating: 4.4
  //   },
  //   {
  //     bookTitle: "Sapiens: A Brief History of Humankind",
  //     bookCoverImg: "https://npr.brightspotcdn.com/dims4/default/a91e0af/2147483647/strip/true/crop/393x522+0+0/resize/880x1169!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F97%2F6a%2F941d3ff44887a15856f4428f85d6%2Fsapiens.png",
  //     bookCategory: "Non-Fiction",
  //     bookPrice: 25.99,
  //     authorName: "Yuval Noah Harari",
  //     bookRating: 4.6
  //   },
  //   {
  //     bookTitle: "A Brief History of Time",
  //     bookCoverImg: "https://m.media-amazon.com/images/I/51XWyS363pL._AC_UF894,1000_QL80_.jpg",
  //     bookCategory: "Science",
  //     bookPrice: 17.49,
  //     authorName: "Stephen Hawking",
  //     bookRating: 4.5
  //   },
  //   {
  //     bookTitle: "The Diary of a Young Girl",
  //     bookCoverImg: "../../../assets/images/diary-young-girl.png",
  //     bookCategory: "History",
  //     bookPrice: 22.50,
  //     authorName: "Anne Frank",
  //     bookRating: 4.8
  //   },
  //   {
  //     bookTitle: "Becoming",
  //     bookCoverImg: "../../../assets/images/becoming.png",
  //     bookCategory: "Biographies",
  //     bookPrice: 15.99,
  //     authorName: "Michelle Obama",
  //     bookRating: 4.7
  //   },
  //   {
  //     bookTitle: "Harry Potter and the Philosopher's Stone",
  //     bookCoverImg: "../../../assets/images/harry-potter.png",
  //     bookCategory: "Fantasy",
  //     bookPrice: 29.99,
  //     authorName: "J.K. Rowling",
  //     bookRating: 4.9
  //   },
  //   {
  //     bookTitle: "Gone Girl",
  //     bookCoverImg: "../../../assets/images/gone-girl.png",
  //     bookCategory: "Mystery",
  //     bookPrice: 18.00,
  //     authorName: "Gillian Flynn",
  //     bookRating: 4.3
  //   },
  //   {
  //     bookTitle: "Pride and Prejudice",
  //     bookCoverImg: "../../../assets/images/pride-prejudice.png",
  //     bookCategory: "Romance",
  //     bookPrice: 21.75,
  //     authorName: "Jane Austen",
  //     bookRating: 4.5
  //   }
  // ];



  ngOnInit(): void {
    this.fetchAllBooks()
  }

  fetchAllBooks(){
    this._allBooksStreamOfBooksService.getStreamOfBooks(this.page,5).subscribe({
      next: (res) => {
        this.allBooks = res.data;
        console.log(res);

      },
      error: (err) => {
        console.log("Error" , err);

      },
      complete: () => {
        console.log("Got All Books From <<<< Books Page >>>>");

      }
    })
  }

  category = "Cooking"
  getBooksByCategory(){
    this._booksCategoryService.getBooksByCategory(this.category,this.page,5).subscribe({
      next: (res) => {
        this.allBooks = res;
        console.log(res.data);
        console.log(this.page);
        console.log(this.category);

      },
      error: (err)=> {
        console.log(err);
      },
      complete: () => {
        console.log("Got Books By Category");

      }
    })
  }

}
