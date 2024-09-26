import { Component, inject, OnInit } from "@angular/core";
import { NgClass, NgFor, NgIf } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  ICreateOrderRequest,
  IPayPalConfig,
  ITransactionItem,
  NgxPayPalModule,
} from "ngx-paypal";
import { GetCartService } from "../../services/cart/GetCart.service";
import { ClearCartService } from "../../services/cart/clear-cart.service";
import { SuccessModalComponent } from "../../components/success-modal/success-modal.component";
import { FailureModalComponent } from "../../components/failure-modal/failure-modal.component";
import { HttpClient } from "@angular/common/http";
import { CreateOrderService } from "../../services/orders/create-order.service";
import { TranslateModule } from "@ngx-translate/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { environment } from "../../../environments/environment";
import { RouterLink } from "@angular/router";
import { CartCountService } from "../../services/cart/CartCount.service";

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    ReactiveFormsModule,
    NgxPayPalModule,
    NgFor,
    SuccessModalComponent,
    FailureModalComponent,
    RouterLink,
    TranslateModule
  ],
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  paypalClientId = environment.paypalClientId;
  httpClient = inject(HttpClient);
  activeTab: string = "orderSummary";
  isRearVisible: boolean = false;
  isTooltipVisible: boolean = false;
  paymentSuccess: boolean = false;
  paymentFailed: boolean = false;
  onlinePaymentOpen: boolean = false;
  payOnDeliveryOpen: boolean = false;
  orderId: string = "";
  orderDate: string = "";
  paymentMethod: string = "paypal";
  shippingAddress: string = "";
  isDetailsDisabled: boolean = false;
  isPaymentDisabled: boolean = false;
  deliveryForm: FormGroup;
  errAddMsg: string = "";
  isLoading: boolean = false;
  numOfCartItems: number = 0;
  // ////////////////////////////////////////////////////////////
  constructor(
    private _getCartService: GetCartService,
    private _clearCartService: ClearCartService,
    private _createOrderService: CreateOrderService,
    private _cartCountService: CartCountService,   
    private _myTranslateService:MyTranslateService
 
  ) {
    this.deliveryForm = new FormGroup({
      firstName: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]{3,15}$"),
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]{3,15}$"),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.pattern("^01\\d{9}$"),
      ]),
      city: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Zs]{1,10}$"),
      ]),
      shippingAddress: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ,.-]{1,30}$"),
      ]),
    });
  }

  public payPalConfig?: IPayPalConfig;

  purchaseItems: {
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
    author: string;
    description: string;
  }[] = [];
  totalPrice: string = "0";
  totalQuantity: number = 0;

  total!: string;
  ngOnInit(): void {
    this.initConfig();
    this.fetchCartItems();
  }

  // order Summery
  private fetchCartItems(): void {
    this._getCartService.getCart().subscribe({
      next: (res) => {
        this.purchaseItems = res.data.books.map((book: any) => ({
          name: book.book.title,
          quantity: book.quantity,
          price: book.book.price,
          imageUrl: book.book.coverImage || "default-image-url",
          author: book.book.author || "Unknown Author",
          description: book.book.description || "No description available",
        }));
        this.calculateTotals();
        this.initConfig();
      },
      error: (err) => {
        console.error("Error fetching cart items", err);
      },
    });
  }
  private calculateTotals(): void {
    this.totalQuantity = this.purchaseItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.totalPrice = `${this.purchaseItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )}`;
  }

  // ////////////////////////////////////////////////////////////

  // Payment PayPal Methods
  private initConfig(): void {
    this.total = this.totalPrice;
    const currency = "USD";
    this.payPalConfig = {
      currency: currency,
      clientId: this.paypalClientId,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: this.total,
                breakdown: {
                  item_total: {
                    currency_code: currency,
                    value: this.total,
                  },
                },
              },
              items: this.purchaseItems.map(
                (x) =>
                  <ITransactionItem>{
                    name: x.name,
                    quantity: x.quantity.toString(),
                    unit_amount: {
                      currency_code: currency,
                      value: x.price.toString(),
                    },
                  }
              ),
            },
          ],
        },
      advanced: {
        commit: "true",
      },
      style: {
        label: "paypal",
        layout: "vertical",
      },
      onApprove: (data, actions) => {
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          "onClientAuthorization - you should probably inform your server about completed transaction at this point",
          data
        );

        // Set order details
        const shippedAddress = data.purchase_units[0].shipping?.address;
        this.orderId = data.id;
        this.orderDate = data.create_time;

        this.shippingAddress = `${shippedAddress?.address_line_1}, ${shippedAddress?.admin_area_2}, ${shippedAddress?.admin_area_1}, ${shippedAddress?.country_code}`; // Set shipping address

        // Clear Cart
        this._clearCartService.clearCart().subscribe({
          next: () => {
            this.paymentSuccess = true;
          },
          error: (err) => {
            console.error("Error clearing cart", err);
          },
        });

        // Save Order
        const orderDetails = {
          orderId: this.orderId,
          orderDate: this.orderDate,
          totalPrice: this.total,
          paymentStatus: "Completed",
          email: data.payer.email_address,
          name: `${data.payer.name?.given_name} ${data.payer.name?.surname}`,
          shippingAddress: this.shippingAddress,
          items: this.purchaseItems.map((item) => ({
            title: item.name,
            author: item.author,
            coverImage: item.imageUrl,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        this._createOrderService.createOrder(orderDetails).subscribe({
          next: () => {
            console.log("success storing order in DB");
            this._cartCountService.setCartCount(0);
          },
          error: (err) => {
            console.error("Error creating order", err);
          },
        });
        this._cartCountService.cartCount$.subscribe((count) => {
          this.numOfCartItems = count;
        });
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
      },
      onError: (err) => {
        console.log("OnError", err);
        this.paymentFailed = true;
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
        this.paymentFailed = false;
        this.paymentSuccess = false;
      },
    };
  }

  // ////////////////////////////////////////////////////////////

  setActiveTab(tab: string): void {
    if (tab === "payment") {
      this.isDetailsDisabled = true;
    }
    if (tab === "confirmation") {
      this.isPaymentDisabled = true;
    }
    this.activeTab = tab;
    this.paymentSuccess = false;
    this.paymentFailed = false;
  }
  toggleAccordion(accordion: string): void {
    if (accordion === "onlinePayment") {
      this.onlinePaymentOpen = !this.onlinePaymentOpen;
      this.payOnDeliveryOpen = false;
    } else if (accordion === "payOnDelivery") {
      this.payOnDeliveryOpen = !this.payOnDeliveryOpen;
      this.onlinePaymentOpen = false;
    }
  }

  public onSuccessModalClose(): void {
    this.paymentSuccess = false;
    this.setActiveTab("confirmation");
  }

  //---------------------- order using pay on delivery method with form submission-----------------
  confirmOrder() {
    const orderDetails = {
      orderId: "",
      totalPrice: this.total,
      name: `${this.deliveryForm.value.firstName} ${this.deliveryForm.value.lastName}`,
      phone: this.deliveryForm.value.phoneNumber,
      email: this.deliveryForm.value.email,
      shippingAddress: `${
        this.deliveryForm.value.shippingAddress +
        ", " +
        this.deliveryForm.value.city
      }`,
      orderDate: new Date(),
      paymentStatus: "Pending",
      paymentMethod: "ondelivery",
      items: this.purchaseItems.map((item) => ({
        title: item.name,
        author: item.author,
        coverImage: item.imageUrl,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    this.errAddMsg = "";

    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
    } else {
      this.isLoading = true;

      this._createOrderService.createOrder(orderDetails).subscribe({
        next: (res: any) => {
          console.log(res);
          this._cartCountService.cartCount$.subscribe((count) => {
            this.numOfCartItems = count;
          });

          this.orderId = res.newOrder.orderId;
          this.orderDate = new Date().toLocaleString();
          this.shippingAddress = orderDetails.shippingAddress;
          this.paymentMethod = orderDetails.paymentMethod;
          this.totalPrice = orderDetails.totalPrice;
          this.setActiveTab("confirmation");
          this._clearCartService.clearCart().subscribe({
            next: () => {
              this._cartCountService.setCartCount(0);
              this.paymentSuccess = true;
            },
            error: (err) => {
              console.error("Error clearing cart", err);
            },
          });

          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(err);
          this.errAddMsg = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
