import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from '../../services/author/author.service';
import { SearchFilterBooksService } from '../../services/books/search-filter-books.service';
import { switchMap } from 'rxjs/operators';
import { BookInterface } from '../../interfaces/books.interface';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { BookCardComponent } from "../../components/book-card/book-card.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-author-details',
  standalone: true,
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss'],
  imports: [SubNavbarComponent, BookCardComponent, LoadingSpinnerComponent, TranslateModule] // Include necessary Angular modules here (e.g. CommonModule, RouterModule, etc.)
 // Include necessary Angular modules here (e.g. CommonModule, RouterModule, etc.)
 // Include necessary Angular modules here (e.g. CommonModule, RouterModule, etc.)
})
export class AuthorDetailsComponent implements OnInit {

  author: any;
  authorBooks: Array<BookInterface> = [];
  authorId: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _authorService: AuthorService,
    private _searchService: SearchFilterBooksService,
    private _myTranslateService :MyTranslateService
  ) {}

  ngOnInit(): void {
    // Fetch author details and books based on the route parameter (authorId)
    this._route.paramMap.pipe(
      switchMap(params => {
        this.authorId = params.get('id') || '';
        if (this.authorId) {
          // Fetch the author details
          return this._authorService.getAuthorById(this.authorId);
        } else {
          throw new Error('Author ID not found');
        }
      })
    ).subscribe({
      next: (res) => {
        this.author = res.data;
        this.isLoading = false;
        // Fetch books for this author once author details are loaded
        this.getAuthorBooks(this.page, this.limit);
        
      },
      error: (err) => {
        console.error('Error fetching author details:', err);
        this.errorMessage = 'Failed to load author details';
        this.isLoading = false;
      }
    });
  }

  
  // Fetch books authored by the author using the SearchFilterBooksService
  getAuthorBooks(page: number, limit: number): void {
    this.isLoading = true;
    this._searchService.getFilteredBooks(
      page,
      limit,
      '', // No category filter
      this.authorId, // Filter by author ID
      '', // No title filter
      'publishedDate', // Sort by published date
      'desc' // Sort in descending order
    ).subscribe({
      next: (res) => {
        this.authorBooks = res.data;
        this.totalPages = res.totalPages;
        this.isLoading = false;
        console.log(this.authorBooks);
        
      },
      error: (err) => {
        console.error('Error fetching author books:', err);
        this.errorMessage = 'Failed to load books for this author';
        this.isLoading = false;
      }
    });
  }

  // Handle pagination change
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getAuthorBooks(this.page, this.limit);
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
