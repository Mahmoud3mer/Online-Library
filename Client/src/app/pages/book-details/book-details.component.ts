import { Component } from '@angular/core';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent {
  quantity: number = 0;
  decreaseBooks(){
    if (this.quantity < 1) {
      this.quantity = 0;
    }else{
      this.quantity -= 1;
    }
    
  }

  increaseBooks(){
    this.quantity += 1;
  }
}
