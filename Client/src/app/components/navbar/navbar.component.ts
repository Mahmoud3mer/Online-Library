import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currencies: string[] = ["$ USD","€ EURO","$ CAD","₹ INR","¥ CNY","৳ CNY"]
  languages: string[] = ["English","Español","Filipino","Français","العربية","हिन्दी"]
  token: string | null = ""
  isLogedIn : boolean = true;

  isDarkMode: boolean = false;

  private isBrowser: Boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: object ,private _darkModeService: DarkModeService) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.isDarkMode = localStorage.getItem('darkMode') === "dark"? true : false
    }
    this.getToken()
  }

  getToken(){
    if (this.isBrowser) {
      this.token = localStorage.getItem('token')
      if (this.token) {
        this.isLogedIn = true;
      }
    }
  }

  logOut(){
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.isLogedIn = false
  }

  toggleDarkMode(event : any){
    if (this.isBrowser) {
      this.isDarkMode = event.target.value === "dark"? true : false;
      localStorage.setItem('darkMode', this.isDarkMode == true? "dark": "light")
    }
    this._darkModeService.toggleDarkMode(event.target.value)
  }
}
