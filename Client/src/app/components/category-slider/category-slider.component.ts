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
}
