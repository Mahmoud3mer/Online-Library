// auto-complete-search.component.ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { apiUrl } from '../../util/apiUrl';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-complete-search',
  standalone: true,
  imports: [TranslateModule,CommonModule,FormsModule],
  templateUrl: './auto-complete-search.component.html',
  styleUrls: ['./auto-complete-search.component.scss'],
})
export class AutoCompleteSearchComponent {
  searchTerm: string = '';
  filteredBooks: any[] = [];
  private searchSubject = new Subject<string>();
  searchType: string = 'title'; // Default search type
  currentPage: number = 1;
  totalResults: number = 0;
  limit: number = 10;

  router = inject(Router);
  constructor(
    private http: HttpClient,
    private _myTranslateService: MyTranslateService
  ) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        if (term.length > 2) {
          this.searchBooks(term);
        } else {
          this.filteredBooks = []; // Clear suggestions if input is too short
        }
      });
  }
  trackByFn(index: number, item: any): number {
    return item.id; // Replace with a unique identifier for your items
}
  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private searchBooks(query: string) {
    const params = {
      [this.searchType === 'title' ? 'title' : 'author']: query,
      page: this.currentPage,
      limit: this.limit,
    };

    this.http.get(`${apiUrl}/books/search`, { params }).subscribe({
      next: (res: any) => {
        this.filteredBooks = res.data;
        this.totalResults = res.results;
        console.log(res);

      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.filteredBooks = []; // Clear suggestions on error

      },
      complete: () => {
        console.log("searched Done");
      }
    }
    );
  }

  onTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.searchType = target.value;
    this.currentPage = 1; // Reset to first page on type change
    this.searchBooks(this.searchTerm); // Trigger search with current term
  }

  selectBook(book: any) {
    this.searchTerm = book.title; // Display the selected name or title
    this.filteredBooks = []; // Clear the suggestions
    this.goToDetails(book._id)
    // Optionally, navigate to the book details page or perform another action
  }

  goToDetails(bookId: string) {
    this.router.navigate(["book-details", bookId])
  }
  // Pagination function (for example, to go to the next page)
  nextPage() {
    this.currentPage++;
    this.searchBooks(this.searchTerm);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchBooks(this.searchTerm);
    }
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

}
