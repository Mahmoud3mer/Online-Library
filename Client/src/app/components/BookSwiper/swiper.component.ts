import { Component , CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { NgForOf } from '@angular/common';
@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [BookCardComponent,NgForOf],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // for swiper
})
export class SwiperComponent {
  breakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 2.5},
    1024: { slidesPerView: 3 },
    1280: { slidesPerView: 3.5 },
    1440: {slidesPerView: 4.2}
  };
  

  @Input() Books: any = [];

}
