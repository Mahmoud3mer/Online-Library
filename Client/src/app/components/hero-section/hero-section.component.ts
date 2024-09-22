import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink,TranslateModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
constructor(private _myTranslateService:MyTranslateService){ }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
