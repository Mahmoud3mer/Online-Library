import { Component } from "@angular/core";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { OrderSuccessComponent } from "../orders/orders-success/order-success/order-success.component";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [SubNavbarComponent, OrderSuccessComponent, TranslateModule],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {

  constructor(private _myTranslateService:MyTranslateService){ }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

}
