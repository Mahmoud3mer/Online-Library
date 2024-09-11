import { Component } from '@angular/core';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [SubNavbarComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss'
})
export class AuthorsComponent {

}
