import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorService } from '../../services/author/author.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  standalone: true, // Standalone component
  imports: [CommonModule, FormsModule,SubNavbarComponent,TranslateModule], // Import necessary modules for ngModel and Angular features
  styleUrls: ['./authors.component.scss'], // Optional SCSS file for any custom styles
})
export class AuthorsComponent implements OnInit {
  authors: any[] = [];
  filteredAuthors: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  limit: number = 10;
  selectedAuthor: any = null;

  constructor(
    private _authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchAuthors();
    this.route.paramMap.subscribe(params => {
      const authorId = params.get('id');
      if (authorId) {
        this.fetchAuthorDetails(authorId); // Fetch the individual author details if ID is present
      }
    });
  }

  // Fetch all authors
  fetchAuthors(): void {
    this._authorService.getAllAuthors(this.page, this.limit).subscribe({
      next: (res) => {
        this.authors = res.data;
        this.filteredAuthors = this.authors; // Initialize filtered authors
      },
      error: (err) => {
        console.log(err);
        
      },
      complete: () => {
        console.log("Got All Authors");
      }
    })
  }

  // Fetch individual author details by ID
  fetchAuthorDetails(id: string): void {
    this._authorService.getAuthorById(id).subscribe((author) => {
      this.selectedAuthor = author; // Set the selected author when ID is present in the URL
    });
  }

  // Handle search input changes
  handleQueryChange(query: string): void {
    this.filteredAuthors = this.authors.filter((author) =>
      author.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Navigate to author details by pushing id to the URL
  selectAuthor(id: string): void {
    this.router.navigate([`/authors/${id}`]); // Navigate to author details page
  }
}
