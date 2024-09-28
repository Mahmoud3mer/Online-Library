import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { CardComponent } from "../../components/card/card.component";
import { CallSectionComponent } from "../../components/call-section/call-section.component";
import { BannerSectionComponent } from "../../components/banner-section/banner-section.component";
import { ShippingInfoComponent } from "../../components/shipping-info/shipping-info.component";
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { BooksService } from "../../services/books/Books.service";
import {
  BookInterface,
  CategoryInterface,
} from "../../interfaces/books.interface";
import { SwiperComponent } from "../../components/BookSwiper/swiper.component";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { HttpClient } from "@angular/common/http";
import { DarkModeService } from "../../services/dark-mode/dark-mode.service";
import { GetUserRecommendationService } from "../../services/recommendation/get-user-recommendation.service";
import { BooksByCategoriesService } from "../../services/recommendation/books-by-categories.service";
import { SearchFilterBooksService } from "../../services/books/search-filter-books.service";
import { CategoryService } from "../../services/category/category.service";
import { AuthorService } from "../../services/author/author.service";
import { isPlatformBrowser } from "@angular/common";
import { AuthorSwiperComponent } from "../../components/author-swiper/author-swiper.component";
import { CategorySliderComponent } from "../../components/category-slider/category-slider.component";
import { TranslateModule } from "@ngx-translate/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { AuthourizationService } from "../../services/users/authourization.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CardComponent,
    CallSectionComponent,
    BannerSectionComponent,
    ShippingInfoComponent,
    HeroSectionComponent,
    SwiperComponent,
    AuthorSwiperComponent,
    CategorySliderComponent,
    SubNavbarComponent,
    TranslateModule,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  allBooks: BookInterface[] = [];

  recommendationBooks: BookInterface[] = [];

  page: number = 1;
  limit: number = 6;

  topRatingBooks: BookInterface[] = [];
  newBooks: BookInterface[] = [];
  book!: BookInterface;
  // sortFor: string = 'averageRating';
  // sortBy: string = 'asc';
  categories: CategoryInterface[] = [];
  authors: any = [];

  // To hide call section logged in
  isLoggedIn: boolean = false;
  isBrowser: boolean = false;
  token: string | null = "";

  constructor(
    private _getUserRecommendation: GetUserRecommendationService,
    private _getBooksByCateg: BooksByCategoriesService,
    private _booksService: BooksService,
    private _httpClient: HttpClient,
    private _darkModeService: DarkModeService,
    private _searchFilterBooksService: SearchFilterBooksService,
    private _categoryService: CategoryService,
    private _authorService: AuthorService,
    @Inject(PLATFORM_ID) platformId: object,
    private _myTranslateService: MyTranslateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

  ngOnInit(): void {
    this.checkTokenAndFetchBooks();
    this.getAuthors();
    this.getBooks();

    this.getTopRatingBooks();
    this.getNewBooks();
    this.getCategories();

    if (this.isBrowser) {
      this.token = localStorage.getItem("token");
      if (this.token) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }
  }

  checkTokenAndFetchBooks(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem("token");

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
          // console.log(res.data.recommendedCategories);

          const categoryIds = res.data.recommendedCategories
            .map((category: CategoryInterface) => category._id)
            .join(",");
          // console.log(categoryIds);

          this.getBooksByRecommendation(categoryIds); // Pass comma-separated category IDs
        }
      },
      error: (err) => {
        console.log("Error fetching user recommendations:", err);
      },
    });
  }

  getBooksByRecommendation(categoryIds: string): void {
    this._getBooksByCateg
      .getBooksByRecommendation(this.page, this.limit, categoryIds)
      .subscribe({
        next: (res) => {
          this.recommendationBooks = res.data; // Set books based on recommendations
          // console.log(res.data);
        },
        error: (err) => {
          console.log("Error fetching books by recommendation:", err);
        },
      });
  }

  getBooks() {
    this._booksService.getAllBooks().subscribe({
      next: (res) => {
        // console.log(res.data);
        this.allBooks = res.data;
      },
      error: (err) => {
        console.log("Error: " + err);
      },
      complete: () => {
        console.log("Get books completed.");
      },
    });
  }

  getTopRatingBooks() {
    this._searchFilterBooksService
      .getFilteredBooks(1, 24, "", "", "", "averageRating", "asc")
      .subscribe({
        next: (res) => {
          // console.log(res.data);
          this.topRatingBooks = res.data;
          this.topRatingBooks.sort((a, b) => b.averageRating - a.averageRating); // Descendig sort
          this.topRatingBooks = this.topRatingBooks.slice(0, 10);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log("Get Top Rating Books Completed.");
        },
      });
  }

  getNewBooks() {
    this._searchFilterBooksService
      .getFilteredBooks(1, 24, "", "", "", "publishedDate", "asc")
      .subscribe({
        next: (res) => {
          // console.log(res.data);
          this.newBooks = res.data;
          this.newBooks.sort(
            (a, b) =>
              new Date(b.publishedDate).getTime() -
              new Date(a.publishedDate).getTime()
          );
          // console.log(res.data);
          // console.log(this.newBooks);
          this.newBooks = this.newBooks.slice(0, 10);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log("Get Top Rating Books Completed.");
        },
      });
  }

  getCategories() {
    this._categoryService.getAllCategory(1, 5).subscribe({
      next: (res) => {
        // console.log(res.data);
        this.categories = res.data;
        // console.log(this.categories);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("Get Categories Completed.");
      },
    });
  }

  // for test but we will use service
  getAuthors() {
    this._authorService.getAllAuthors(1, 5).subscribe({
      next: (res) => {
        // console.log(res);
        this.authors = res.data;
      },
      error: (err) => {
        console.log("Error: " + err);
      },
      complete: () => {
        console.log("Get authors completed.");
      },
    });
  }
}
