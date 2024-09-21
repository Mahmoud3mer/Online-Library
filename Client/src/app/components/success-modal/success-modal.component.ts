import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-success-modal",
  standalone: true,
  imports: [NgIf],
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
}
