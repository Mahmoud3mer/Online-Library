import { Component } from '@angular/core';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [SubNavbarComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

}
