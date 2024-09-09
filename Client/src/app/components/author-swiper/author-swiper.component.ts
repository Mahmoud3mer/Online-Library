import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-author-swiper',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './author-swiper.component.html',
  styleUrl: './author-swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // for swiper
})
export class AuthorSwiperComponent {
  @Input() authors: any;
}
