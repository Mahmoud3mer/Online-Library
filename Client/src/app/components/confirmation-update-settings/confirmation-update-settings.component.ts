import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-update-settings',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confirmation-update-settings.component.html',
  styleUrl: './confirmation-update-settings.component.scss'
})
export class ConfirmationUpdateSettingsComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Input() successedMessage: string = "";
  @Input() errorMessagePassword: string = "";
constructor(private _myTranslateService:MyTranslateService){ }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}


