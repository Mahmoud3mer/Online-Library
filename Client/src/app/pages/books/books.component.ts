import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { BookCardComponent } from "../../components/book-card/book-card.component";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import {
  AuthorInterface,
  BookInterface,
  CategoryInterface,
} from "../../interfaces/books.interface";
import { AllBooksStreamOfBooksService } from "../../services/books/all-books-stream-of-books.service";
import { CategoryService } from "../../services/category/category.service";
import { SearchFilterBooksService } from "../../services/books/search-filter-books.service";
import { AuthorService } from "../../services/author/author.service";
import { debounceTime, Subject } from "rxjs";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { BooksGridListComponent } from "../../components/books-grid-list/books-grid-list.component";
import { BooksListComponent } from "../../components/books-list/books-list.component";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { TranslateModule } from "@ngx-translate/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { AutoCompleteSearchComponent } from "../../components/auto-complete-search/auto-complete-search.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: "app-books",
  standalone: true,
  imports: [
    BookCardComponent,
    SubNavbarComponent,
    CommonModule,
    BooksGridListComponent,
    BooksListComponent,
    RouterLink,
    RouterLinkActive,
    PaginationComponent,
    TranslateModule,
    AutoCompleteSearchComponent,
    LoadingSpinnerComponent
  ],

  templateUrl: "./books.component.html",
  styleUrls: ["./books.component.scss"],
})
export class BooksComponent implements OnInit {
  metaData: any;

  allBooks: Array<BookInterface> = [];
  filteredBooks: Array<BookInterface> = [];
  categories: Array<CategoryInterface> = [];
  authors: Array<AuthorInterface> = [];
  page: number = 1;
  catPage: number = 1;
  authorPage: number = 1;


  booksLimit: number = 6;
  filteredCategory: string = '';
  selectedCategory: string = '';

  filteredAuthor: string = "";
  selectedAuthor: string = "";

  searchedTitle: string = "";

  sortFor: string = "";
  sortBy: string = "";
  selecetedSort = "";
  currentView: string = "grid"; // Default view

  private searchSubject = new Subject<string>();

  constructor(
    private _categoryService: CategoryService,
    private _authorService: AuthorService,
    private _searchFilterBooksService: SearchFilterBooksService,
    private route: ActivatedRoute,
    private router: Router,
    private _myTranslateService: MyTranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  
  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.onSearchFilter(searchTerm);
    });
    this.router.events.subscribe(() => {
      const url = this.route.firstChild?.snapshot.url
      .map((segment) => segment.path)
      .join("");
      this.currentView = url || "list";
    });
    if (isPlatformBrowser(this.platformId)) {
      this.loadBooks();
      this.getAllCategories();
      this.getAllAuthors();
    }
  }
  
  onSearchInputChange(event: Event): void {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchSubject.next(searchTerm);
  }
  onFormSubmit(event: Event): void {
    event.preventDefault();
    this.loadBooks();
  }
  
  
  bookPages!: number;
  categoryPages!: number;
  authorPages!: number;

  loadBooks(): void {
    this._searchFilterBooksService
      .getFilteredBooks(
        this.page,
        this.booksLimit,
        this.filteredCategory.trim(),
        this.filteredAuthor.trim(),
        this.searchedTitle.trim(),
        this.sortFor.trim(),
        this.sortBy.trim()
      )
      .subscribe({
        next: (res) => {
          console.log("API Response for page:", this.page, res);
  
          if (res.metaData) {
            this.filteredBooks = res.data;
            this.allBooks = this.filteredBooks;
            this.bookPages = res.metaData.numberOfPages || 1;
            this.page = res.metaData.currentPage || 1; // Ensure we set to 1 if not available
          }
          console.log(this.filteredBooks);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  
  onPageChanged(newBookPage: number): void {
    console.log("Page changed to:", newBookPage);
    if (newBookPage !== this.page) {
      this.page = newBookPage;
      this.loadBooks(); // Load books for the new page
    }
  }

  loadMoreCategories() {
    ++this.catPage
    this.getAllCategories()
  }

  resetCategories() {
    this.catPage = 1;
    this.resetAllCategories()
  }
  loadMoreAuthors() {
    ++this.authorPage
    this.getAllAuthors()
  }

  resetAuthors() {
    this.authorPage = 1;
    this.resetAllAuthors()
  }

  resetAllCategories(): void {
    this._categoryService.getAllCategory(this.catPage, 5).subscribe({
      next: (res) => {
        this.categories = res.data;
        this.categoryPages = res.metaData.numberOfPages || 1;
        this.catPage = res.metaData.currentPage || 1; // Ensure we set to 1 if not available
        console.log(this.categories);
        console.log(this.catPage);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log("Got All Categories");
      },
    });
  }
  resetAllAuthors(): void {
    this._authorService.getAllAuthors(this.authorPage, 5).subscribe({
      next: (res) => {
        this.authors = res.data;
        this.authorPages = res.metaData.numberOfPages || 1;
        this.authorPage = res.metaData.currentPage || 1; // Ensure we set to 1 if not available
        console.log(this.authors);
        console.log(this.authorPage);
        
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log("Got All Authors");
      },
    });
  }
  

  getAllCategories(): void {
    this._categoryService.getAllCategory(this.catPage, 5).subscribe({
      next: (res) => {
        this.categories = [...this.categories,...res.data];
        this.categoryPages = res.metaData.numberOfPages || 1;
        this.catPage = res.metaData.currentPage || 1; // Ensure we set to 1 if not available

      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log("Got All Categories");
      },
    });
  }

  getAllAuthors(): void {
    this._authorService.getAllAuthors(this.authorPage, 5).subscribe({
      next: (res) => {
        this.authors = [...this.authors,...res.data];
        this.authorPages = res.metaData.numberOfPages || 1;
        this.authorPage = res.metaData.currentPage || 1; // Ensure we set to 1 if not available

      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log("Got All Authors");
      },
    });
  }

  onFilterSelect(
    categoryId: string = "",
    authorId: string = "",
    searchByTitle: string = ""
  ): void {
    if (categoryId) this.filteredCategory = categoryId;
    if (authorId) this.filteredAuthor = authorId;
    if (searchByTitle) this.searchedTitle = searchByTitle;

    this.page = 1;
    this.loadBooks();
  }

  onCategoryFilter(categoryId: string): void {
    if (this.filteredCategory === categoryId) {
      this.filteredCategory = "";
      this.selectedCategory = "";
    } else {
      this.filteredCategory = categoryId;
      this.selectedCategory = categoryId;
    }
    this.page = 1;

    this.loadBooks();
  }

  onAuthorFilter(authorId: string): void {
    if (this.filteredAuthor === authorId) {
      this.selectedAuthor = "";
      this.filteredAuthor = "";
    } else {
      this.selectedAuthor = authorId;
      this.filteredAuthor = authorId;
    }
    this.page = 1;

    this.loadBooks();
  }

  onSearchFilter(searchByTitle: string): void {
    if (searchByTitle.trim() === "") {
      this.searchedTitle = "";
    } else {
      this.searchedTitle = searchByTitle;
    }
    console.log("this trun from search");
    console.log(this.searchedTitle);

    this.loadBooks();
  }

  sortByPopularity() {
    this.sortFor = "averageRating";
    this.sortBy = "asc";
    this.loadBooks();
  }
  sortByAtoZ() {
    this.sortFor = "title";
    this.sortBy = "asc";
    this.loadBooks();
  }
  sortByZtoA() {
    this.sortFor = "title";
    this.sortBy = "desc";
    this.loadBooks();
  }
  sortByLowToHigh() {
    this.sortFor = "price";
    this.sortBy = "asc";
    this.loadBooks();
  }
  sortByHighToLow() {
    this.sortFor = "price";
    this.sortBy = "desc";
    this.loadBooks();
  }

  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    switch (selectedValue) {
      case "popularity":
        this.sortByPopularity();
        break;
      case "atoz":
        this.sortByAtoZ();
        break;
      case "ztoa":
        this.sortByZtoA();
        break;
      case "lowhigh":
        this.sortByLowToHigh();
        break;
      case "highlow":
        this.sortByHighToLow();
        break;
    }
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

}
