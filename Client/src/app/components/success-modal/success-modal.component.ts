import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-success-modal",
  standalone: true,
  imports: [NgIf,TranslateModule],
  templateUrl: "./success-modal.component.html",
  styleUrl: "./success-modal.component.scss",
})
export class SuccessModalComponent {
  @Input() isVisible: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();

  closeModal() {
    this.isVisible = false;
    this.modalClosed.emit();
  }
  constructor(private _myTranslateService:MyTranslateService){ }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
