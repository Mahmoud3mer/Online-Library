import { AfterViewInit, Component , Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { SubNavbarComponent } from "../../components/navbar/sub-navbar/sub-navbar.component";
import { OrderSuccessComponent } from "../orders/orders-success/order-success/order-success.component";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [SubNavbarComponent, OrderSuccessComponent, TranslateModule],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit, AfterViewInit {

  constructor(
    private _myTranslateService: MyTranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(L => {
        this.initMap(L);
      });
    }
  }
  initMap(L: any): void {
    const map = L.map('map').setView([28.1003, 30.7582], 13); 
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 23,
      attribution: '© Online Library'
    }).addTo(map);
  
    const redIcon = L.icon({
      iconUrl: 'https://img.icons8.com/ios-filled/50/FF0000/marker.png',
      iconSize: [25, 41], 
      iconAnchor: [25, 41], 
      popupAnchor: [1, -34],
    });
  
    L.marker([28.1003, 30.7582], { icon: redIcon }).addTo(map);
  }

  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
