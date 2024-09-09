import { Component, Input } from '@angular/core';
import { BookInterface } from '../../interfaces/books';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() book!: BookInterface;

}
