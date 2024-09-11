import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkMode = false
  isBrowser: boolean = false

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadDarkModeFromLocalS()
  }

  toggleDarkMode(mode: string): void {
    this.isDarkMode = !this.isDarkMode;
    this.saveDarkMode(mode);
    this.applyDarkMode();
  }

  applyDarkMode(){
    if (this.isDarkMode) {
      if (this.isBrowser) {
        document.documentElement.classList.add('dark')
      }
    }else{
      if (this.isBrowser) {
        document.documentElement.classList.remove('dark')
      }

    }
  }

  private saveDarkMode(mode: string): void {
    if (this.isBrowser) {
      localStorage.setItem('darkMode', mode);
    }
  }

  loadDarkModeFromLocalS(){
    if (this.isBrowser) {
      let darkMode = localStorage.getItem('darkMode')
      this.isDarkMode = darkMode === 'dark'? true : false;
    }

    this.applyDarkMode();
  }

}
