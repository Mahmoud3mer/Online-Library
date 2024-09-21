import { Component , CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategorySliderComponent {
  @Input() categories: any;

  breakpoints = {
    640: { slidesPerView: 1, spaceBetween: 5 },
    768: { slidesPerView: 2, spaceBetween: 10 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
    1280: { slidesPerView: 3, spaceBetween: 30 }
  };
  
}
