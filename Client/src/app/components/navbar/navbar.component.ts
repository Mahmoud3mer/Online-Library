import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthourizationService } from '../../services/users/authourization.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLoggedIn = false;
  username: string = '';
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  constructor(private _authorizationService: AuthourizationService) {
    this._authorizationService.loggedIn.subscribe((token) => {
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
          // this.username = storedUsername
          //   .split('')
          //   .slice(1, 3)
          //   .join('')
          //   .toUpperCase();
          this.username = storedUsername.slice(1, storedUsername.length - 1);
          console.log(this.username);
        } else {
          this.username = 'UNKNOWN';
        }
      } else {
        this.username = '';
      }
    });
  }

  logout() {
    this._authorizationService.logOut();
  }
}
