import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-update-settings',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-update-settings.component.html',
  styleUrl: './confirmation-update-settings.component.scss'
})
export class ConfirmationUpdateSettingsComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Input() successedMessage: string = "";
  @Input() errorMessagePassword: string = "";


  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}


