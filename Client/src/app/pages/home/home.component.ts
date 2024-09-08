import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CallSectionComponent } from '../../components/call-section/call-section.component';
import { BannerSectionComponent } from '../../components/banner-section/banner-section.component';
import { ShippingInfoComponent } from '../../components/shipping-info/shipping-info.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent,CallSectionComponent,BannerSectionComponent,ShippingInfoComponent,HeroSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {

}
