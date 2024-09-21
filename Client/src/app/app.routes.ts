import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { BooksComponent } from "./pages/books/books.component";
import { CartComponent } from "./pages/cart/cart.component";
import { CheckOutComponent } from "./pages/check-out/check-out.component";
import { WishlistComponent } from "./pages/wishlist/wishlist.component";
import { SigninComponent } from "./pages/signin/signin.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { UserSettingsComponent } from "./pages/user-settings/user-settings.component";
import { BookDetailsComponent } from "./pages/book-details/book-details.component";
import { Err404Component } from "./pages/err404/err404.component";
import { AuthorsComponent } from "./pages/authors/authors.component";
import { EmailVerifiedComponent } from "./pages/email-Verified/email-verified/email-verified.component";
import { BooksGridListComponent } from "./components/books-grid-list/books-grid-list.component";
import { BooksListComponent } from "./components/books-list/books-list.component";
import { RecommendationComponent } from "./pages/recommendation/recommendation.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password/reset-password.component";
import { PaymentComponent } from "./pages/payment/payment.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "payment",
    component: PaymentComponent,
  },
  {
    path: "book-details/:id",
    component: BookDetailsComponent,
  },
  {
    path: "books",
    component: BooksComponent,
    children: [
      {
        path: "",
        redirectTo: "grid",
        pathMatch: "full",
      },
      {
        path: "grid",
        component: BooksGridListComponent,
      },
      {
        path: "list",
        component: BooksListComponent,
      },
    ],
  },
  {
    path: "check-out",
    component: CheckOutComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "wishlist",
    component: WishlistComponent,
  },
  {
    path: "recommendation",
    component: RecommendationComponent,
  },
  {
    path: "signin",
    component: SigninComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  { path: "verify-email", component: EmailVerifiedComponent },
  {
    path: "user-settings",
    component: UserSettingsComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "authors",
    component: AuthorsComponent,
  },
  {
    path: "**",
    component: Err404Component,
  },
];
