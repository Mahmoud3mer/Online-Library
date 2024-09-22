import { Component } from '@angular/core';
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
export class FootbarComponent {
  constructor(private _myTranslateService:MyTranslateService){ }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
