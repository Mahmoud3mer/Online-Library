
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookInterface } from '../../interfaces/books.interface';
 

@Injectable({
  providedIn: 'root'
})
export class CartBooksService {
  private cartBooks = new BehaviorSubject<BookInterface[]>([]);
  private isBrowser: boolean = false;
  cartBooks$ = this.cartBooks.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedCartBooks = localStorage.getItem('cartBooks');
      const initialBooks = storedCartBooks ? JSON.parse(storedCartBooks) : [];

      this.updateCartBooks(initialBooks);  
    }
  }

  updateCartBooks(newBooks: BookInterface[]): void {
    if (this.isBrowser) {
      localStorage.setItem('cartBooks', JSON.stringify(newBooks));
    }
    this.cartBooks.next(newBooks);
  }

  clearCartBooks(): void {
    if (this.isBrowser) {
      localStorage.removeItem('cartBooks');
    }
    this.cartBooks.next([]);
  }
}
