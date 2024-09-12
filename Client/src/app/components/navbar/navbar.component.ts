import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, inject, PLATFORM_ID } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { DarkModeService } from "../../services/dark-mode/dark-mode.service";
import { NgClass, NgIf } from "@angular/common";
import { AuthourizationService } from "../../services/users/authourization.service";
import { SubNavbarComponent } from "./sub-navbar/sub-navbar.component";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass, SubNavbarComponent],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  isLoggedIn = false;
  username: string = "";
  isDropdownOpen = false;
  isFadeIn = false;
  isFadeOut = false;

  languages: string[] = [
    "English",
    "Español",
    "Filipino",
    "Français",
    "العربية",
    "हिन्दी",
  ];
  token: string | null = "";
  isLogedIn: boolean = true;
  isDarkMode: boolean = false;
  private isBrowser: Boolean = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private _darkModeService: DarkModeService,
    private _authorizationService: AuthourizationService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.isDarkMode =
        localStorage.getItem("darkMode") === "dark" ? true : false;
    }
    this.getToken();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getToken() {
    if (this.isBrowser) {
      this.token = localStorage.getItem("token");
      if (this.token) {
        this.isLogedIn = true;
      }
    }
  }

  toggleDarkMode() {
    this.isFadeOut = true;

    setTimeout(() => {
      this.isDarkMode = !this.isDarkMode;
      this.isFadeOut = false;
      this.isFadeIn = false;
      void document.body.offsetWidth;

      this.isFadeIn = true;
    }, 400);
    localStorage.setItem("darkMode", this.isDarkMode ? "dark" : "light");
    this._darkModeService.toggleDarkMode(this.isDarkMode ? "dark" : "light");
  }

  // Darkmode without animation
  // toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode; // Toggle the dark mode state
  //   localStorage.setItem("darkMode", this.isDarkMode ? "dark" : "light"); // Save to localStorage
  //   this._darkModeService.toggleDarkMode(this.isDarkMode ? "dark" : "light"); // Notify the dark mode service
  // }

  logout() {
    this._authorizationService.logOut();
  }
}
