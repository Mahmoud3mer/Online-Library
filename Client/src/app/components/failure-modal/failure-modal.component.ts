import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-failure-modal",
  standalone: true,
  imports: [NgIf],
  templateUrl: "./failure-modal.component.html",
  styleUrl: "./failure-modal.component.scss",
})
export class FailureModalComponent {
  @Input() isVisible: boolean = false;

  closeModal() {
    this.isVisible = false;
  }
}
