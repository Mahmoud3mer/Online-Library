import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/reviews/review.service';
import { BooksService } from '../../services/books/Books.service';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { jwtDecode } from "jwt-decode";
import { ReviewInterface } from '../../interfaces/review.interface';
import { StarsLoopComponent } from '../../components/stars-loop/stars-loop.component';
import { TranslateModule } from '@ngx-translate/core';
import { MyTranslateService } from '../../services/translation/my-translate.service';

interface DecodedToken {
  userId: string;
}
@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [SubNavbarComponent,ReactiveFormsModule, NgClass,ConfirmationDialogComponent ,StarsLoopComponent, TranslateModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
}) 

export class BookDetailsComponent implements OnInit {

  quantity: number = 0;
  book: any = {};
  bookId: any= "";
  userId: string = "";
  token : string | null = ""
  reviewsPagination: any = [];
  AllReviews: any = [];
  reviewFromDB: any = {};
  reviewsLength: number = 0
  reviewsRatingsNumber: number = 0
  bookRating: number = 0
  page: number = 1;
  limit: number = 10;
  showDropdown: { [key: string]: boolean } = {};
  showConfirmationDialog:boolean = false
  bookIdToRemove :string = ''
  reviewID: string = ''

  private isBrowser: Boolean = false;
  isLoggedIn: boolean = false;

  commentLength: number = 0
  starArray: number[] = [];

  isUpdaiting: boolean = false;

  @ViewChild('commentInput') commentInput!: ElementRef;


  reviewForm: FormGroup = new FormGroup({
    comment: new FormControl(null,[Validators.required, Validators.maxLength(500),Validators.minLength(1)]),
    rating: new FormControl(null,[Validators.required, Validators.min(1),Validators.max(5)]),
    bookId: new FormControl(this.route.snapshot.paramMap.get('id')), //book id from route(url)
  })



  constructor(private _myTranslateService:MyTranslateService 
    , private route: ActivatedRoute ,private _httpClient: HttpClient,private _reviewService:ReviewService,private _booksService:BooksService ,@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.bookId = this.route.snapshot.paramMap.get('id')
    this.getUserIdFromToken()
    if (this.isBrowser) {
      this.isLoggedIn = localStorage.getItem('token')? true: false;
    }
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.getAllReviewsFromDb()
    this.getBookFromDb()
    this.getReviewsFromDb()
  }



  decreaseBooks(){
    if (this.quantity < 1) {
      this.quantity = 0;
    }else{
      this.quantity -= 1;
    }
  }

  increaseBooks(bookStock : number){
    if (this.quantity < bookStock ) {
      this.quantity += 1;
    }
    
  }

  sendReview(){
    this.addReviewInDb()
    this.reviewForm.reset()
  } 

  // ! get userId from token
    getUserIdFromToken(){
    if (this.isBrowser) {
    this.token = localStorage.getItem('token');
        if (this.token) {
      const decodedToken = jwtDecode<DecodedToken>(this.token);
      this.userId = decodedToken.userId
      // console.log(this.userId);
      // console.log("userid from token" ,this.userId)
    }
  }
  }


  // !Book
  getBookFromDb(){
      this._booksService.getSinglBook(this.bookId).subscribe({
      next: (res) => {
        console.log(res.data)
        this.book = res.data
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("Get book by id completed")
      }
    })
  }

  // !Reviews
  getAllReviewsFromDb(){
    this._reviewService.getAllReviews(this.bookId).subscribe({
      next: (res) => {
        this.AllReviews = res.data
        this.reviewsLength = this.AllReviews.length
        this.reviewsRatingsNumber = this.AllReviews.reduce((total:number, element: any) => {return total + element.rating;}, 0)
        if (this.reviewsRatingsNumber == 0) {
          this.bookRating = 0;
        }
        else{
          this.bookRating = this.reviewsRatingsNumber / this.reviewsLength;
        }
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("Get reviews completed")
      }
    })
  }

  //! pagination
  getReviewsFromDb(){
    this._reviewService.getPaginationReviews(this.bookId ,this.page, this.limit).subscribe({
      next: (res) => {
        console.log(res.data)
        this.reviewsPagination = res.data
        // this.reviewsLength = this.reviews.length
        // this.reviewsRatingsNumber = this.reviews.reduce((total:any, element: any) => {return total + element.rating;}, 0)
        // this.bookRating = this.reviewsRatingsNumber / this.reviews.length;
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("Get reviews completed")
      }
    })
  }


  addReviewInDb(){
    const reviewData: ReviewInterface = {
      bookId: this.bookId,
      rating: this.reviewForm.get('rating')?.value,
      comment: this.reviewForm.get('comment')?.value
    };

    this._reviewService.addReview(reviewData).subscribe({
      next: (res) => {
        // console.log(this.reviewForm.value)
        
        console.log(res.addedReview[0])
        this.reviewsPagination.push(res.addedReview[0]);
        // this.reviewForm.reset();
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("Add review completed")
        this.getReviewsFromDb()
        this.getAllReviewsFromDb()
      }
    })
  }

  updateReviewInDb(reviewId: string){
    const reviewData: ReviewInterface = {
      bookId: this.bookId,
      rating: this.reviewForm.get('rating')?.value,
      comment: this.reviewForm.get('comment')?.value
    };

    this._reviewService.updateReview(reviewId, reviewData).subscribe({
      next: (res) => {
        console.log(res)
        // this.getReviewsFromDb()
        this.getReviewsFromDb()
        this.getAllReviewsFromDb()
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("Update review completed")
        // this.getReviewsFromDb()
        // this.getAllReviewsFromDb()
      }
    })
  }

  deleteReviewFromDb(reviewId: string){
    this._reviewService.deleteReview(reviewId).subscribe({
      next: (res) => {
        console.log(res)
        console.log(res.message)
      },
      error: (err) => {
        console.log(err)
        
      },
      complete: () => {
        console.log("Delete review completed")
        this.showConfirmationDialog = false;
        this.getAllReviewsFromDb()
        this.getReviewsFromDb()
      }
    })
  }

  loadMoreReviews(){
    this.limit += 10;
    this.getReviewsFromDb();
    console.log(this.AllReviews.length);
    console.log(this.reviewsPagination.length);
    
  }

  showLessReviews(){
    this.page = 1;
    this.limit = 10;
    this.getReviewsFromDb();
  }

  toggleDropdown(reviewId: string){
    this.showDropdown[reviewId] = !this.showDropdown[reviewId];
  }


  deleteReview(reviewId: string){
    this.deleteReviewFromDb(reviewId)
    this.getReviewsFromDb();
  }

  updateReview(reviewId: string){
    // ! to add comment in textarea field to update
    this._reviewService.getOneReview(reviewId).subscribe({
      next: (res) => {
        console.log("from update:",res.reviewById.comment)
        this.reviewFromDB = res.reviewById
        this.reviewID = reviewId
        this.isUpdaiting = true
        this.commentInput.nativeElement.focus();
        // ! add value in form
        this.reviewForm.patchValue({
          comment: this.reviewFromDB.comment,
          rating: this.reviewFromDB.rating
        });
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("Get one review completed")
      }
    })
  }

  sendUpdatingReview(){
    this.updateReviewInDb(this.reviewID)
    this.isUpdaiting = false
    this.reviewForm.reset();
    // console.log(this.reviewForm.value);
    
  }

  calcLengthComment(){
    this.commentLength = this.reviewForm.value.comment.length
  }


  //confirmation //
  openConfirmationDialog(bookId: string): void {
    this.bookIdToRemove = bookId;
    this.showConfirmationDialog = true;
  }

  handleConfirm(): void {
    this.deleteReview(this.bookIdToRemove)
  }

  handleCancel() {
    this.showConfirmationDialog = false;
  }
}




//   updateStarArray(): void {
//     const fullStars = Math.floor(this.bookRating);
//     const halfStar = this.bookRating % 1 !== 0;

//     this.starArray = Array(fullStars).fill(1);
//     if (halfStar) {
//       this.starArray.push(0.5);
//     }
//     const emptyStars = 5 - this.starArray.length;
//     this.starArray.push(...Array(emptyStars).fill(0));
//   }
  
//   changeLang(lang: string) {
//     this._myTranslateService.changLang(lang);
//   }
// }

  
// >>>>>>> master
