import { Component, Input } from '@angular/core';
import { BookInterface } from '../../interfaces/books.interface';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() book!: BookInterface;

  constructor(private _myTranslateService:MyTranslateService){ }
   
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}