import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CallSectionComponent } from '../../components/call-section/call-section.component';
import { BannerSectionComponent } from '../../components/banner-section/banner-section.component';
import { ShippingInfoComponent } from '../../components/shipping-info/shipping-info.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { BooksService } from '../../services/books/Books.service';
import { BookInterface } from '../../interfaces/books.interface';
import { SwiperComponent } from '../../components/BookSwiper/swiper.component';
import { AuthorSwiperComponent } from '../../components/author-swiper/author-swiper.component';
import { AddBooksService } from '../../services/books/add-book.service';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent,
    CallSectionComponent,
    BannerSectionComponent,
    ShippingInfoComponent,
    HeroSectionComponent,
    SwiperComponent,
    AuthorSwiperComponent,
    SubNavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  allBooks: BookInterface[] = [];

  book!: BookInterface ;

      // ! for test (المحتوى هييي من اليوسر ك براميتر)
  // body = {
  //   title: "JS",
  //   price: 250,
  //   publishedDate: new Date(),
  //   image: "../../../assets/images/download.jfif",
  //   description: "llllllllllllllllllllllll",
  //   category: "any",
  //   rating: 3.5,
  //   pages: 350,
  //   authorId: "66d62249018d3485209bbcdf",
  //   stock: 25,
  // };

  // For swiper
  authors: any = []


  // ! Test add book (in form data)
  // selectedFile: File | null = null;  // لتخزين الملف المختار

  constructor(private _booksService: BooksService , private _httpClient: HttpClient, private _darkModeService: DarkModeService){}

  ngOnInit(): void {
    this.getBooks()
    this.getAuthors()
  }

  getBooks(){
    this._booksService.getAllBooks().subscribe({
      next: (res) => {
        // console.log(res);
        this.allBooks = res
      },
      error: (err) => {
        console.log("Error: " + err);
      },
      complete: () =>{
        console.log("Get books completed.");
      }
    })
  }

  // for test but we will use service
  getAuthors(){
    this._httpClient.get(`assets/author.json`).subscribe({
      next: (res) => {
        // console.log(res);
        this.authors = res
      },
      error: (err) => {
        console.log("Error: " + err);
      },
      complete: () =>{
        console.log("Get books completed.");
      }
    })
  }


  // ! Test add book (in form data)
  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];  // تخزين الملف المختار
  // }


  // addMyBook(){
  //   this.addBook()
  // }

  // addBook(){
  //   const formData = new FormData();
  //   // إضافة بيانات الكتاب إلى الـ formData
  //   Object.keys(this.body).forEach(key => {
  //     formData.append(key, (this.body as any)[key]);
  //   });
  //   // إضافة الصورة إذا كانت موجودة
  //   if (this.selectedFile) {
  //     formData.append('image', this.selectedFile, this.selectedFile.name);
  //   }

  //   this._addBooksService.addNewBook(formData).subscribe({
  //     next: (res) => {
  //       console.log(res.data);
  //       this.allBooks = res.data
  //     },
  //     error: (err) => {
  //       console.log("Error: " + err);
  //     },
  //     complete: () =>{
  //       console.log("Added book completed.");
  //     }
  //   })
  // }
}
