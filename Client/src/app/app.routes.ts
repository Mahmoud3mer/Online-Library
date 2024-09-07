import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BooksComponent } from './pages/books/books.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckOutComponent } from './pages/check-out/check-out.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { Err404Component } from './pages/err404/err404.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'book-details',
    component: BookDetailsComponent
  },
  {
    path: 'books',
    component: BooksComponent
  },
  {
    path: 'check-out',
    component: CheckOutComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent
  },
  {
    path: '**',
    component: Err404Component,
  },
];
