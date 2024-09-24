import { Component, OnInit } from "@angular/core";
import { GetOrdersService } from "../../services/orders/get-orders.service";
import { OrderInterface } from "../../interfaces/order.interface";
import { NgFor, NgIf } from "@angular/common";
import { InvoiceModalComponent } from "../../components/invoice-modal/invoice-modal.component";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-my-orders",
  standalone: true,
  imports: [NgFor, NgIf, InvoiceModalComponent, TranslateModule],
templateUrl: "./my-orders.component.html",
  styleUrl: "./my-orders.component.scss",
})
export class MyOrdersComponent implements OnInit {
  showInvoiceModal = false;
  selectedOrder: OrderInterface | null = null;
  orders: OrderInterface[] = [];

  constructor(private _getOrdersService: GetOrdersService, private _myTranslateService:MyTranslateService) {}

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders(): void {
    this._getOrdersService.getOrdersOfUser().subscribe({
      next: (data) => {
        this.orders = data;
        console.log(this.orders);
      },
      error: (err) => {
        console.error("Error fetching orders:", err);
      },
    });
  }

  toggleInvoiceModal(order: OrderInterface) {
    this.selectedOrder = order;
    this.showInvoiceModal = !this.showInvoiceModal;
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
