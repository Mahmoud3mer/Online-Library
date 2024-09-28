import { isPlatformBrowser, NgClass, NgIf } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";

import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AuthourizationService } from "../../services/users/authourization.service";
import { Router, RouterOutlet } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { environment } from "../../../environments/environment";
import { GetUserRecommendationService } from "../../services/recommendation/get-user-recommendation.service";
import { GetWishlistService } from "../../services/wishlist/getWishlist.service";
import { GetCartService } from "../../services/cart/GetCart.service";
import { CartCountService } from "../../services/cart/CartCount.service";
import { WishlistBookService } from "../../services/wishlist/wishlist-books.service";
import { CartBooksService } from "../../services/cart/cart-books.service";
import { WishListCountService } from "../../services/wishlist/wish-list-count.service";

declare var google: any;
@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    FormsModule,
    RouterOutlet,
    TranslateModule,
  ],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.scss",
})
export class SignupComponent implements OnInit {
  googleClientId = environment.googleClientId;
  successRegMsg: string = "";
  errRegMsg: string = "";
  isLoading: boolean = false;
  router = inject(Router);
  isBrowser: boolean;
  isLoggedIn: boolean = false;
  hide: boolean = true;
  hideConfirm: boolean = true;
  toggleVisibility(): void {
    this.hide = !this.hide;
  }

  toggleConfirmVisibility(): void {
    this.hideConfirm = !this.hideConfirm;
  }

  constructor(
    private _authourizationService: AuthourizationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _myTranslateService: MyTranslateService,
    private _getUserRecommendationService: GetUserRecommendationService,
    private _getWishlist: GetWishlistService,
    private _getCartService: GetCartService,
    private _cartCountService: CartCountService,
    private _wishlistBooksService: WishlistBookService,
    private _cartBooksService: CartBooksService,
    private _numOfWishlist: WishListCountService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadGoogleSignInScript()
        .then(() => {
          this.initializeGoogleSignIn();
        })
        .catch((error) => {
          console.error("Error loading Google Sign-In script:", error);
        });
    }
  }

  private loadGoogleSignInScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.accounts) {
        // Google Sign-In script is already loaded
        resolve();
      } else {
        if (this.isBrowser) {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Failed to load Google Sign-In script"));
          document.head.appendChild(script);
        } else {
          reject(new Error("Document is not available"));
        }
      }
    });
  }

  private initializeGoogleSignIn(): void {
    if (typeof google !== "undefined" && google.accounts) {
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: this.handleCredentialResponse.bind(this),
      });

      const googleButton = document.getElementById(
        "google-button"
      ) as HTMLElement;
      if (googleButton) {
        google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
        });
      } else {
        console.error("Google button container is not available");
      }
    } else {
      console.error("Google Sign-In library is not loaded.");
    }
  }

  handleCredentialResponse(response: any): void {
    console.log("Encoded JWT ID token: " + response.credential);
    this.ngZone.run(() => {
      this._authourizationService
        .verifyGoogleToken(response.credential)
        .subscribe({
          next: (res) => {
            this._authourizationService.saveUserToken(
              res.data.token,
              res.username
            );
            this.getWishList();
            this.getCart();
            this.checkRecommendations();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error("Login failed", err);
          },
        });
    });
  }

  /*----------Registration Form ----------- */
  registerForm: FormGroup = new FormGroup(
    {
      fName: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]{3,15}$"),
      ]),
      lName: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]{3,15}$"),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("^01\\d{9}$"),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?:.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>?/\\|`~])?.{8,}$"
        ),
      ]),
      rePassword: new FormControl("", [Validators.required]),
      role: new FormControl("user", [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
    },
    {
      validators: [this.match("password", "rePassword")],
    }
  );

  register() {
    this.errRegMsg = "";
    this.successRegMsg = "";
    console.log(this.registerForm.value);

    if (this.registerForm.valid === false) {
      this.registerForm.markAllAsTouched();
    } else {
      this.isLoading = true;
      const { terms, rePassword, ...formData } = this.registerForm.value;
      this._authourizationService.signUp(formData).subscribe({
        next: (res: any) => {
          console.log(res);
          this.successRegMsg = res.message;
          this.isLoading = false;
          this.registerForm.reset();
        },
        error: (err) => {
          console.log(err);
          this.errRegMsg = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }

  // Password-Repassword matching Fn
  match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors["matching"]) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  checkRecommendations(): void {
    this._getUserRecommendationService.getRecommendation().subscribe({
      next: (res) => {
        if (res.message == "Recommendations retrieved successfully") {
          this.router.navigate(["/home"]);
        } else {
          this.router.navigate(["/recommendation"]);
        }
      },
      error: (err) => {
        console.log(err, "error from check recommendation");
        this.router.navigate(["/home"]);
      },
      complete: () => {
        console.log("Recommendations check complete");
      },
    });
  }

  getWishList() {
    console.log("get");

    this._getWishlist.getWishlist().subscribe({
      next: (res) => {
        this._numOfWishlist.updateNumOfWishItems(res.data.books.length);
        this._wishlistBooksService.updateWishlistBooks(res.data.books);
      },
      error: (err) => {
        console.log(err, "err get wish list prodcuts");
      },
      complete: () => {
        console.log("get wish list  books >> login");
      },
    });
  }

  getCart() {
    this._getCartService.getCart().subscribe({
      next: (res) => {
        this._cartCountService.updateNumOfCartItems(res.data.numOfCartItems); // Update cart count

        this._cartBooksService.updateCartBooks(res.data.books); // Update cart books
      },
      error: (err) => {
        console.log("Error getting cart in login:", err);
      },
      complete: () => {
        console.log("Cart fetched successfully in login");
      },
    });
  }
}
