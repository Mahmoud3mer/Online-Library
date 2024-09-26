import { Component, OnChanges, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footbar',
  standalone: true,
  imports: [RouterLink,TranslateModule],
  templateUrl: './footbar.component.html',
  styleUrl: './footbar.component.scss'
})
export class FootbarComponent implements OnInit, OnChanges{
  footerLogo: string = '';

  constructor(private _myTranslateService:MyTranslateService){ }
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
    const mode = localStorage.getItem('darkMode')
    if(!mode) {
      this.footerLogo = '../../../assets/images/logo/AndlosiaLogo.png'
    }
    if(mode === 'light' ) {
      this.footerLogo = '../../../assets/images/logo/AndlosiaLogo.png'
    } else {
      this.footerLogo = '../../../assets/images/logo/AndlosiaLogo.png'
      // this.footerLogo = '../../../assets/images/logo/AndalosiaLogoWhite.png'
    }
  }

  
}
