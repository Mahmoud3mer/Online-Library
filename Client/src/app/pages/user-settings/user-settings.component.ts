import { Component } from '@angular/core';
import { SubNavbarComponent } from '../../components/navbar/sub-navbar/sub-navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [SubNavbarComponent, RouterOutlet, RouterLinkActive, RouterLink, TranslateModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
  constructor(private _myTranslateService:MyTranslateService){ }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
