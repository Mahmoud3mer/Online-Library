import { Component } from "@angular/core";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { OrderSuccessComponent } from "../orders/orders-success/order-success/order-success.component";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [SubNavbarComponent, OrderSuccessComponent],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {}
