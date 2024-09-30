import { NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import jsPDF from "jspdf";
import { OrderInterface } from "../../interfaces/order.interface";
import { TranslateModule } from "@ngx-translate/core";
import { MyTranslateService } from "../../services/translation/my-translate.service";

@Component({
  selector: "app-invoice-modal",
  templateUrl: "./invoice-modal.component.html",
  styleUrl: "./invoice-modal.component.scss",
  standalone: true,
  imports: [NgIf, NgFor,TranslateModule],
})
export class InvoiceModalComponent {
  @Input() isVisible = false;
  @Input() orderData: OrderInterface | null = null; // Add this input
  @Output() close = new EventEmitter<void>();
constructor(private _myTranslateService:MyTranslateService){ }
  generatePDF() {
    if (!this.orderData) return; // Ensure orderData is available
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(22);
    doc.text("Andalusia Services", 20, 20);
    doc.setFontSize(16);
    doc.text("Invoice", 20, 30);
    doc.text(`Date: ${this.orderData.orderDate}`, 20, 40);
    doc.text(`Invoice #: ${this.orderData.orderId}`, 20, 50);

    doc.setFontSize(14);
    doc.text("Bill To:", 20, 70);
    doc.text(this.orderData.shippingAddress, 20, 80);

    // Table headers
    doc.text("Description", 20, 130);
    doc.text("Amount", 160, 130);

    // Table rows
    this.orderData.items.forEach((item, index) => {
      doc.text(item.title, 20, 140 + 10 * index);
      doc.text(`$${item.price.toFixed(2)}`, 160, 140 + 10 * index);
    });

    doc.text("Total", 20, 140 + 10 * this.orderData.items.length);
    doc.text(
      `$${this.orderData.totalPrice.toFixed(2)}`,
      160,
      140 + 10 * this.orderData.items.length
    );

    // Save the PDF
    doc.save("invoice.pdf");
  }

  closeModal() {
    this.close.emit();
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
