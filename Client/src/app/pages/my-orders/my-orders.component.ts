import { Component, OnInit } from "@angular/core";
import { GetOrdersService } from "../../services/orders/get-orders.service";
import { OrderInterface } from "../../interfaces/order.interface";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { InvoiceModalComponent } from "../../components/invoice-modal/invoice-modal.component";
import { CartCountService } from "../../services/cart/CartCount.service";

@Component({
  selector: "app-my-orders",
  standalone: true,
  imports: [NgFor, NgIf, InvoiceModalComponent, NgClass],
  templateUrl: "./my-orders.component.html",
  styleUrl: "./my-orders.component.scss",
})
export class MyOrdersComponent implements OnInit {
  showInvoiceModal = false;
  selectedOrder: OrderInterface | null = null;
  orders: OrderInterface[] = [];
  currentPage: number = 1;
  ordersPerPage: number = 5;
  constructor(private _getOrdersService: GetOrdersService) {}

  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.ordersPerPage;
    return this.orders.slice(startIndex, startIndex + this.ordersPerPage);
  }

  totalPages() {
    return Math.ceil(this.orders.length / this.ordersPerPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders(): void {
    this._getOrdersService.getOrdersOfUser().subscribe({
      next: (data) => {
        this.orders = data;
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
