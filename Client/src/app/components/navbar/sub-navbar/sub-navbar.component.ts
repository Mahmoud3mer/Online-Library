import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartCountService } from "../../../services/cart/CartCount.service";
import { WishListCountService } from "../../../services/wishlist/wish-list-count.service";
import { CartBooksService } from "../../../services/cart/cart-books.service";
import { MyTranslateService } from "../../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";
import { io, Socket } from "socket.io-client";
import { apiUrl } from "../../../util/apiUrl";
import { AutoCompleteSearchComponent } from "../../auto-complete-search/auto-complete-search.component";


@Component({
  selector: "app-sub-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule,AutoCompleteSearchComponent],
  templateUrl: "./sub-navbar.component.html",
  styleUrls: ["./sub-navbar.component.scss"],
})
export class SubNavbarComponent implements OnInit {
  numOfCartItems: number = 0;
  numOfWishlistItems: number = 0;
  cartBooks: any[] = [];
  numOfNotifications: number = 0;
  private socket!: Socket;

  constructor(
    private _cartCountService: CartCountService,
    private _wishlistCount: WishListCountService,
    private _cartBooksService: CartBooksService,
    private _myTranslateService: MyTranslateService,
    private ngZone: NgZone

  ) {}

  ngOnInit(): void {
    this._cartCountService.cartCount$.subscribe((count) => {
      this.numOfCartItems = count;
    });

    this._wishlistCount.wishlistCount$.subscribe((count) => {
      this.numOfWishlistItems = count;
    });

    this._cartBooksService.cartBooks$.subscribe((books) => {
      this.cartBooks = books;
    });

    // // Initialize WebSocket connection with reconnection settings
    // this.socket = io(apiUrl, {
    //   reconnection: false, // Disable reconnection attempts
    // });

    // this.socket.on("connect", () => {
    //   console.log("Socket connected");
    // });

    // this.socket.on("disconnect", (reason) => {
    //   console.log("Socket disconnected:", reason);
    // });

    // this.socket.on("reconnect_attempt", () => {
    //   console.log("Socket attempting to reconnect...");
    // });

    // this.socket.on("paymentStatusChanged", (payload) => {
    //   this.ngZone.run(() => this.handlePaymentStatusChange(payload));
    // });
  }

  // handlePaymentStatusChange(payload: any) {
  //   this.numOfNotifications++;
  //   console.log("Notification count increased:", this.numOfNotifications);
  // }

  // // Add ngOnDestroy lifecycle hook
  // ngOnDestroy(): void {
  //   if (this.socket) {
  //     console.log("Disconnecting socket...");
  //     this.socket.disconnect(); // Properly close the WebSocket connection
  //   }
  // }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
