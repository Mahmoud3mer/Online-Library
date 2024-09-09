import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CallSectionComponent } from '../../components/call-section/call-section.component';
import { BannerSectionComponent } from '../../components/banner-section/banner-section.component';
import { ShippingInfoComponent } from '../../components/shipping-info/shipping-info.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { BooksService } from '../../services/books/Books.service';
import { BookInterface } from '../../interfaces/books';
import { SwiperComponent } from '../../components/BookSwiper/swiper.component';
import { AuthorSwiperComponent } from '../../components/author-swiper/author-swiper.component';
import { AddBooksService } from '../../services/books/add-book.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent,
    CallSectionComponent,
    BannerSectionComponent,
    ShippingInfoComponent,
    HeroSectionComponent,
    SwiperComponent,
    AuthorSwiperComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  allBooks: BookInterface[] = [];
  book!: BookInterface ;
  
      // ! for test (المحتوى هييي من اليوسر ك براميتر)
  body = {
    title: "JS",
    price: 250,
    publishedDate: new Date(),
    image: "../../../assets/images/download.jfif",
    description: "llllllllllllllllllllllll",
    category: "any",
    rating: 3.5,
    pages: 350,
    authorId: "66d62249018d3485209bbcdf",
    stock: 25,
  };

  // For swiper
  authors= [
    {
      id: 1,
      name: "Ernest Hemingway",
      bio: "Ernest Miller Hemingway was an American novelist, short-story writer and journalist.",
      image: "../../../assets/images/authors/Ernest Hemingway.jpeg"
    },
    {
      id: 2,
      name: "Khaled Hosseini",
      bio: "Khaled Hosseini is an Afghan-American novelist, UNHCR goodwill ambassador, and former physician.",
      image: "../../../assets/images/authors/Khaled Hossein.jpeg"
    },
    {
      id: 3,
      name: "Franz Kafka",
      bio: "Franz Kafka was a German-language novelist and writer from Prague.",
      image: "../../../assets/images/authors/Franz Kafka.jpeg"
    },
    {
      id: 3,
      name: "Franz Kafka",
      bio: "Franz Kafka was a German-language novelist and writer from Prague.",
      image: "../../../assets/images/authors/Franz Kafka.jpeg"
    },
    {
      id: 3,
      name: "Franz Kafka",
      bio: "Franz Kafka was a German-language novelist and writer from Prague.",
      image: "../../../assets/images/authors/Franz Kafka.jpeg"
    },
    {
      id: 3,
      name: "Franz Kafka",
      bio: "Franz Kafka was a German-language novelist and writer from Prague.",
      image: "../../../assets/images/authors/Franz Kafka.jpeg"
    }
  ]

  loopTest = [
    {
      bookTitle: "The Great Gatsby",
      bookCoverImg: "https://i0.wp.com/americanwritersmuseum.org/wp-content/uploads/2018/02/CK-3.jpg?resize=267%2C400&ssl=1",
      bookCategory: "Fiction",
      bookPrice: 19.99,
      authorName: "F. Scott Fitzgerald",
      bookRating: 4.4
    },
    {
      bookTitle: "Sapiens: A Brief History of Humankind",
      bookCoverImg: "https://npr.brightspotcdn.com/dims4/default/a91e0af/2147483647/strip/true/crop/393x522+0+0/resize/880x1169!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F97%2F6a%2F941d3ff44887a15856f4428f85d6%2Fsapiens.png",
      bookCategory: "Non-Fiction",
      bookPrice: 25.99,
      authorName: "Yuval Noah Harari",
      bookRating: 4.6
    },
    {
      bookTitle: "A Brief History of Time",
      bookCoverImg: "https://m.media-amazon.com/images/I/51XWyS363pL._AC_UF894,1000_QL80_.jpg",
      bookCategory: "Science",
      bookPrice: 17.49,
      authorName: "Stephen Hawking",
      bookRating: 4.5
    },
    {
      bookTitle: "The Diary of a Young Girl",
      bookCoverImg: "../../../assets/images/diary-young-girl.png",
      bookCategory: "History",
      bookPrice: 22.50,
      authorName: "Anne Frank",
      bookRating: 4.8
    },
    {
      bookTitle: "Becoming",
      bookCoverImg: "../../../assets/images/becoming.png",
      bookCategory: "Biographies",
      bookPrice: 15.99,
      authorName: "Michelle Obama",
      bookRating: 4.7
    },
    {
      bookTitle: "Harry Potter and the Philosopher's Stone",
      bookCoverImg: "../../../assets/images/harry-potter.png",
      bookCategory: "Fantasy",
      bookPrice: 29.99,
      authorName: "J.K. Rowling",
      bookRating: 4.9
    },
    {
      bookTitle: "Gone Girl",
      bookCoverImg: "../../../assets/images/gone-girl.png",
      bookCategory: "Mystery",
      bookPrice: 18.00,
      authorName: "Gillian Flynn",
      bookRating: 4.3
    },
    {
      bookTitle: "Pride and Prejudice",
      bookCoverImg: "../../../assets/images/pride-prejudice.png",
      bookCategory: "Romance",
      bookPrice: 21.75,
      authorName: "Jane Austen",
      bookRating: 4.5
    }
  ];

  // ! Test add book (in form data)
  selectedFile: File | null = null;  // لتخزين الملف المختار

  constructor(private _booksService: BooksService, private _addBooksService: AddBooksService){}

  ngOnInit(): void {
    this.getBooks()
  }

  // ! Test add book (in form data)
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];  // تخزين الملف المختار
  }


  addMyBook(){
    this.addBook()
  }

  addBook(){
    const formData = new FormData();
    // إضافة بيانات الكتاب إلى الـ formData
    Object.keys(this.body).forEach(key => {
      formData.append(key, (this.body as any)[key]);
    });
    // إضافة الصورة إذا كانت موجودة
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this._addBooksService.addNewBook(formData).subscribe({
      next: (res) => {
        console.log(res.data);
        this.allBooks = res.data
      },
      error: (err) => {
        console.log("Error: " + err);
      },
      complete: () =>{
        console.log("Added book completed.");
      }
    })
  }



  getBooks(){
    this._booksService.getAllBooks().subscribe({
      next: (res) => {
        console.log(res.data);
        this.allBooks = res.data
      },
      error: (err) => {
        // console.log("Error: " + err);
      },
      complete: () =>{
        console.log("Get all books completed.");
      }
    })
  }

  //   getOneBook(){
  //     this._booksService.getSinglBook(bookId).subscribe({
  //     next: (res) => {
  //       console.log(res.data);
  //       this.book = res.data
  //     },
  //     error: (err) => {
  //       // console.log("Error: " + err);
  //     },
  //     complete: () =>{
  //       console.log("Get one book completed.");
  //     }
  //   })
  // }

  // updateBook(){
  //   this._booksService.updateTheBook("66d7359b85c5b10f2c17bbdf", this.body).subscribe({
  //     next: (res) => {
  //       // console.log(res.data);
  //       this.book = res.data
  //     },
  //     error: (err) => {
  //       // console.log("Error: " + err);
  //     },
  //     complete: () =>{
  //       console.log("Get one book completed.");
  //     }
  //   })
  // }

}
