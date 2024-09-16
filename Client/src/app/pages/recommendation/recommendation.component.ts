import { Component, OnInit } from '@angular/core';
import { GetAllCategService } from '../../services/recommendation/get-all-categ.service';
import { CreateRecommendationService } from '../../services/recommendation/create-recommendation.service'; // Updated service name
import { ToastService } from '../../services/Toast/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation',
  standalone:true,
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'], // Tailwind CSS is used for styling
  imports:[CommonModule]
})
export class RecommendationComponent implements OnInit {
  categories: any[] = [];
  selectedCategories: string[] = []; // Track selected category IDs

  constructor(
    private _getCateg: GetAllCategService,
    private _recommendationService: CreateRecommendationService , 
    private _toast:ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this._getCateg.getCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories = res.data;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Categories fetched successfully');
      }
    });
  }

  toggleCategorySelection(categoryId: string): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId); // Add if not selected
      console.log(`Category ${categoryId} added`);
    } else {
      this.selectedCategories.splice(index, 1); // Remove if already selected
      console.log(`Category ${categoryId} removed`);
    }
    console.log(this.selectedCategories);
    
  }
  
  saveSelections(): void {
    if (this.selectedCategories.length > 0) {
      this._recommendationService.createRecommendation(this.selectedCategories).subscribe({
        next: (res) => {
          console.log('Selections saved:', res);
          this._toast.showSuccess("Welcome ")
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error saving selections:', err);
        },
        complete: () => {
          console.log('Save selections request complete');
        }
      });
    } else {
      console.log('No categories selected');
      this._toast.showError("No categories selected")
      
    }
  }
  
  skipSelections(): void {
    this.router.navigate(['/home']);
  }
}
