import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BookInterface } from "../../interfaces/books.interface";

@Injectable({
  providedIn: "root",
})
export class WishlistBookService {
  private wishlistBooks = new BehaviorSubject<BookInterface[]>([]);
  private isBrowser: boolean = false;
  wishlistBooks$ = this.wishlistBooks.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedWishlistBooks = localStorage.getItem("wishlistBooks");
      const initialBooks = storedWishlistBooks
        ? JSON.parse(storedWishlistBooks)
        : [];

      this.updateWishlistBooks(initialBooks);
    }
  }
  

  isBookWishlisted(bookId: string): boolean {
    const books = this.wishlistBooks.getValue();
    return books.some(book => book._id === bookId);
  }
  
  updateWishlistBooks (newBooks: BookInterface[]): void {
    if (this.isBrowser) {
        localStorage.setItem("wishlistBooks", JSON.stringify(newBooks));
    }
    this.wishlistBooks.next(newBooks);
  }

  clearWishlistBooks(): void {
    if (this.isBrowser) {
        localStorage.removeItem("wishlistBooks");
    }
    this.wishlistBooks.next([]);
  }
}
