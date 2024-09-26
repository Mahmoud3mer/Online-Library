import { Component } from "@angular/core";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { DarkModeService } from "../../services/dark-mode/dark-mode.service";
import { PaymentComponent } from "../payment/payment.component";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [SubNavbarComponent, PaymentComponent, TranslateModule, RouterLink],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
})
export class AboutComponent {
  constructor(private _myTranslateService:MyTranslateService){ }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
