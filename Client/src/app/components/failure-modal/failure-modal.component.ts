import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-failure-modal",
  standalone: true,
  imports: [NgIf, TranslateModule],
  templateUrl: "./failure-modal.component.html",
  styleUrl: "./failure-modal.component.scss",
})
export class FailureModalComponent {
  @Input() isVisible: boolean = false;

  closeModal() {
    this.isVisible = false;
  }
  constructor(private _myTranslateService:MyTranslateService){ }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
