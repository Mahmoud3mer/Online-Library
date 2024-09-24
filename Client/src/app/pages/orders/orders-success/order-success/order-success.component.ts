import { Component } from '@angular/core';
import { MyTranslateService } from '../../../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent {

  constructor(private _myTranslateService:MyTranslateService){ }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
