import { Component } from '@angular/core';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [SubNavbarComponent, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

}
