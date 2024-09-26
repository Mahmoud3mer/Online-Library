import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone:true,
  imports:[TranslateModule],
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})  
export class ConfirmationDialogComponent {
  constructor(private _myTranslateService:MyTranslateService){ }
  @Input() title: string = 'Confirm Action'; // Default title
  @Input() message: string = 'Are you sure you want to proceed?'; // Default message
  @Input() confirmText: string = 'Confirm'; // Default confirm button text
  @Input() cancelText: string = 'Cancel'; // Default cancel button text

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

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
