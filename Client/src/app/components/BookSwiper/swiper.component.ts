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
    640: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 3, spaceBetween: 30 },
    1024: { slidesPerView: 4, spaceBetween: 40 },
    1280: { slidesPerView: 5, spaceBetween: 50 }
  };
  

  @Input() Books: any = [];

}
