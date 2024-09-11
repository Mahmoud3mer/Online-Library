import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/reviews/review.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [SubNavbarComponent,ReactiveFormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
}) 

export class BookDetailsComponent implements OnInit ,DoCheck {
  quantity: number = 0;
  bookId: number | undefined;
  reviews: any = []
  reviewData: any = {}

  reviewForm: FormGroup = new FormGroup({
    comment: new FormControl(null,[Validators.required, Validators.maxLength(500),Validators.minLength(1)]),
    raiting: new FormControl(0,[Validators.required, Validators.min(1),Validators.max(5)]),
    userId: new FormControl('66d73d8f3434d1cf9a985c4d'),
    bookId: new FormControl('66d7359b85c5b10f2c17bbdf'),
  })
  constructor(private route: ActivatedRoute ,private _httpClient: HttpClient,private _reviewService:ReviewService) {
  }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    // ! Call api to get book by id
    console.log(this.bookId);
    
    // this.getReviewsFromDb()
  }
  ngDoCheck(): void {
    // this.getReviewsFromDb()
  }

  decreaseBooks(){
    if (this.quantity < 1) {
      this.quantity = 0;
    }else{
      this.quantity -= 1;
    }
    
  }

  increaseBooks(){
    this.quantity += 1;
  }

  sliceName(name: string){
    let spaceChar = name.indexOf(' ');
    if (!spaceChar) {
      return name;
    }else{
      return name.slice(0,spaceChar + 2);
    }
  }

  sendReview(){
    // this.addReviewInDb()
  }


  // getReviewsFromDb(){
  //   this._reviewService.getAllReviews().subscribe({
  //     next: (res) => {
  //       // console.log(res.allReviews)
  //       this.reviews = res.allReviews
  //     },
  //     error: (err) => {
  //       console.log(err)
  //     },
  //     complete: () => {
  //       console.log("Get reviews completed")
  //     }
  //   })
  // }

  // addReviewInDb(){
  //   this._reviewService.addReview(this.reviewForm.value).subscribe({
  //     next: (res) => {
  //       console.log(res)
  //     },
  //     error: (err) => {
  //       console.log(err)
  //     },
  //     complete: () => {
  //       console.log("Add review completed")
  //     }
  //   })
  // }

  // updateReviewInDb(){
  //   this._reviewService.updateReview("66e0e333ac29e0f3c68ed588",this.reviewForm.value).subscribe({
  //     next: (res) => {
  //       console.log(res)
  //     },
  //     error: (err) => {
  //       console.log(err)
  //     },
  //     complete: () => {
  //       console.log("Update review completed")
  //     }
  //   })
  // }

  // deleteReviewFromDb(){
  //   this._reviewService.deleteReview("66e0e333ac29e0f3c68ed588").subscribe({
  //     next: (res) => {
  //       console.log(res)
  //     },
  //     error: (err) => {
  //       console.log(err)
  //     },
  //     complete: () => {
  //       console.log("Delete review completed")
  //     }
  //   })
  // }

}
