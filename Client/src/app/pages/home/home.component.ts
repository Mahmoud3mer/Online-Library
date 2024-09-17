import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CallSectionComponent } from '../../components/call-section/call-section.component';
import { BannerSectionComponent } from '../../components/banner-section/banner-section.component';
import { ShippingInfoComponent } from '../../components/shipping-info/shipping-info.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { BooksService } from '../../services/books/Books.service';
import { BookInterface, CategoryInterface } from '../../interfaces/books.interface';
import { SwiperComponent } from '../../components/BookSwiper/swiper.component';
import { AuthorSwiperComponent } from '../../components/author-swiper/author-swiper.component';
import { AddBooksService } from '../../services/books/add-book.service';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';
import { GetUserRecommendationService } from '../../services/recommendation/get-user-recommendation.service';
import { BooksByCategoriesService } from '../../services/recommendation/books-by-categories.service';
import { isPlatformBrowser } from '@angular/common';

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
  recommendationBooks:BookInterface[]=[];
  private isBrowser: boolean = false;
  book!: BookInterface ;
  page: number = 1;
  limit: number = 60;
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

  constructor(   @Inject(PLATFORM_ID) platformId: object,
    private _booksService: BooksService , private _httpClient: HttpClient, private _darkModeService: DarkModeService,
    private _getUserRecommendation:GetUserRecommendationService,
    private _getBooksByCateg:BooksByCategoriesService, 
  ){
    this.isBrowser = isPlatformBrowser(platformId);

  }

  ngOnInit(): void {
    this.checkTokenAndFetchBooks();
    this.getAuthors()
    this.getBooks();

  }
  
  checkTokenAndFetchBooks(): void {
    if(this.isBrowser){
        const token = localStorage.getItem('token');
    
    if (token) {
      // If a token exists, fetch recommendations
      this.checkForRecommendations();
    } 
    }
  
  }

  checkForRecommendations(): void {
    this._getUserRecommendation.getRecommendation().subscribe({
      next: (res) => {
        if (res.data && res.data.recommendedCategories.length > 0) {
          // Map the category IDs and join them into a comma-separated string
          console.log(res.data.recommendedCategories);
          
          const categoryIds = res.data.recommendedCategories.map((category: CategoryInterface) => category._id).join(',');
          console.log(categoryIds);
          
          this.getBooksByRecommendation(categoryIds); // Pass comma-separated category IDs
        } 
      },
      error: (err) => {
        console.log('Error fetching user recommendations:', err);
        
      }
    });
  }

  getBooksByRecommendation(categoryIds: string): void {
    this._getBooksByCateg.getBooksByRecommendation(this.page, this.limit, categoryIds).subscribe({
      next: (res) => {
        this.recommendationBooks = res.data; // Set books based on recommendations
        console.log(res.data);
        
      },
      error: (err) => {
        console.log('Error fetching books by recommendation:', err);
      }
    });
  }







  getBooks(){
    this._booksService.getAllBooks().subscribe({
      next: (res) => {
        console.log(res);
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
