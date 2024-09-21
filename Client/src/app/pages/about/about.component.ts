import { Component } from "@angular/core";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { DarkModeService } from "../../services/dark-mode/dark-mode.service";
import { PaymentComponent } from "../payment/payment.component";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [SubNavbarComponent, PaymentComponent, ],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
})
export class AboutComponent {}
