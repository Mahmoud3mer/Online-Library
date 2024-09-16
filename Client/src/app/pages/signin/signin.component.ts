import { isPlatformBrowser, NgClass, NgIf } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthourizationService } from '../../services/users/authourization.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router'; // Import Router
import { CookieService } from 'ngx-cookie-service';
import { GetUserRecommendationService } from '../../services/recommendation/get-user-recommendation.service';

// Default values shown

@Component({
  selector: "app-signin",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule, NgClass,RouterOutlet ,RouterLink],
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
  providers: [CookieService],
})
export class SigninComponent {
  successLogMsg: string = "";
  errLogMsg: string = "";
  isLoading: boolean = false;
  rememberMeChecked: boolean = false;
  constructor(
    private _authourizationService: AuthourizationService,
    private router: Router,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _getUserRecommendationService:GetUserRecommendationService
  ) {}

  // get email if in  cookies
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = this.cookieService.get("savedEmail");
      const savedPass = this.cookieService.get("savedPassword");
      const rememberMe = this.cookieService.get("rememberMe") === "true";

      if (savedEmail) {
        this.loginForm.get("email")?.setValue(savedEmail);
        this.rememberMeChecked = true; // Check the checkbox if email is saved
      }

      if (savedPass) {
        this.loginForm.get("password")?.setValue(savedPass);
      }

      const checkboxElement = document.getElementById(
        "default-checkbox"
      ) as HTMLInputElement;
      if (checkboxElement) {
        checkboxElement.checked = this.rememberMeChecked;
      }
    }
  }

  /*----------Login Form ----------- */
  loginForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  login() {
    this.errLogMsg = "";
    this.successLogMsg = "";
    if (this.loginForm.valid === false) {
      this.loginForm.markAllAsTouched();
    } else {
      this.isLoading = true;
      const email = this.loginForm.get("email")?.value;
      const password = this.loginForm.get("password")?.value;
      const rememberMe = (
        document.getElementById("default-checkbox") as HTMLInputElement
      )?.checked;

      if (rememberMe) {
        this.cookieService.set("savedEmail", email, 30); // Save email for 30 days
        this.cookieService.set("savedPassword", password, 30);
        this.cookieService.set("rememberMe", "true", 30);
      } else {
        this.cookieService.delete("savedEmail");
        this.cookieService.delete("savedPassword");
        this.cookieService.delete("rememberMe");
      }

      this._authourizationService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.loginForm.reset();
          this._authourizationService.saveUserToken(res.token);

          this.router.navigate(["/home"]);
          this.checkRecommendations();
        },
        error: (err) => {
          console.log(err);
          this.errLogMsg = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }







  // recommendation
  checkRecommendations(): void {
    this._getUserRecommendationService.getRecommendation().subscribe({
      next: (res) => {
        if (res.message=="Recommendations retrieved successfully") {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/recommendation']);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Recommendations check complete');
      }
    });
  }

}










