import { Component, Inject, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footbar',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './footbar.component.html',
  styleUrl: './footbar.component.scss'
})
export class FootbarComponent implements OnInit, OnChanges {
  footerLogo: string = '';

  constructor(private _myTranslateService: MyTranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

  ngOnInit(): void {
    this.checkForLogo()
  }
  ngOnChanges(): void {
    this.checkForLogo()
  }
  checkForLogo() {
    if (isPlatformBrowser(this.platformId)) {

      const mode = localStorage.getItem('darkMode')
      if (!mode) {
        this.footerLogo = '../../../assets/images/logo/AndlosiaLogo.png'
      }
      if (mode === 'light') {
        this.footerLogo = '../../../assets/images/logo/AndlosiaLogo.png'
      } else {
        this.footerLogo = '../../../assets/images/logo/AndlosiaLogo.png'
        // this.footerLogo = '../../../assets/images/logo/AndalosiaLogoWhite.png'
      }
    }
  }


}
