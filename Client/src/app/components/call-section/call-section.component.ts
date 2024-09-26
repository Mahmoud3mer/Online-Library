import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-call-section',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './call-section.component.html',
  styleUrl: './call-section.component.scss'
})
export class CallSectionComponent implements OnInit {
  isLoggedIn: boolean = false;
  isBrowser: boolean = false;
  token: string | null = ''

  constructor(@Inject(PLATFORM_ID) platformId: object, private _myTranslateService:MyTranslateService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.isLoggedIn = true
      }else{
        this.isLoggedIn = false
      }
    }
  }
 
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
