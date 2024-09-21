import { Component, inject, OnInit } from "@angular/core";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
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
import { paypalClientId } from "../../util/apiUrl";

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
  ],
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
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
  // ////////////////////////////////////////////////////////////
  constructor(
    private _getCartService: GetCartService,
    private _clearCartService: ClearCartService,
    private _createOrderService: CreateOrderService
  ) {}
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
      clientId: paypalClientId,
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
        this.orderId = data.id; // Set order ID
        this.orderDate = data.create_time; // Set order date
        this.shippingAddress = `${shippedAddress?.address_line_1}, ${shippedAddress?.address_line_2}, ${shippedAddress?.admin_area_2}, ${shippedAddress?.country_code}`; // Set shipping address

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
          },
          error: (err) => {
            console.error("Error creating order", err);
          },
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
      this.isDetailsDisabled = true; // Disable details tab when moving to payment
    }
    if (tab === "confirmation") {
      this.isPaymentDisabled = true; // Disable payment tab when moving to confirmation
    }
    this.activeTab = tab;
    this.paymentSuccess = false;
    this.paymentFailed = false;
  }
  toggleAccordion(accordion: string): void {
    if (accordion === "onlinePayment") {
      this.onlinePaymentOpen = !this.onlinePaymentOpen;
      this.payOnDeliveryOpen = false; // Close the other accordion
    } else if (accordion === "payOnDelivery") {
      this.payOnDeliveryOpen = !this.payOnDeliveryOpen;
      this.onlinePaymentOpen = false; // Close the other accordion
    }
  }

  confirmOrder() {
    // Logic to handle pay on delivery
    console.log("Order confirmed");
  }

  public onSuccessModalClose(): void {
    this.paymentSuccess = false; // Reset payment success flag
    this.setActiveTab("confirmation"); // Switch to confirmation tab
  }
}
