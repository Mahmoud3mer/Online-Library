import { Component } from '@angular/core';
import { MyTranslateService } from '../../services/translation/my-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shipping-info',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './shipping-info.component.html',
  styleUrl: './shipping-info.component.scss'
})
export class ShippingInfoComponent {
  constructor(private _myTranslateService:MyTranslateService){ }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
