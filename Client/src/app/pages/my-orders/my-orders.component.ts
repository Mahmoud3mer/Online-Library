import { Component, OnInit } from "@angular/core";
import { GetOrdersService } from "../../services/orders/get-orders.service";
import { OrderInterface } from "../../interfaces/order.interface";
import { NgFor, NgIf } from "@angular/common";
import { InvoiceModalComponent } from "../../components/invoice-modal/invoice-modal.component";

@Component({
  selector: "app-my-orders",
  standalone: true,
  imports: [NgFor, NgIf, InvoiceModalComponent],
  templateUrl: "./my-orders.component.html",
  styleUrl: "./my-orders.component.scss",
})
export class MyOrdersComponent implements OnInit {
  showInvoiceModal = false;
  selectedOrder: OrderInterface | null = null;
  orders: OrderInterface[] = [];

  constructor(private _getOrdersService: GetOrdersService) {}

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
}
