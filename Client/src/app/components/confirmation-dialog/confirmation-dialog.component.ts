import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})  
export class ConfirmationDialogComponent {
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
}
