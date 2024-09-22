import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MyTranslateService {

  constructor(private _translate:TranslateService, @Inject(PLATFORM_ID) private platFormId:object) {
 
    if(isPlatformBrowser(platFormId)){
       //declare var defaulte lang
    let defaultLang='en';
    //get lang in localStorage
    let savedLang=localStorage.getItem('lang');
    //check savedLang=true(contain value)=>change defaulte lang==saveLang
    if(savedLang){
      defaultLang=savedLang;
    }
    //set defaulte lang
    _translate.setDefaultLang(defaultLang)
    //set use lang
    _translate.use(defaultLang);

    //call method change dir
    // this.changeDirection(defaultLang);

    }

   }

   //change direction
  //  changeDirection(lang:string){
  // if(lang==='en'){
  //   document.dir='ltr';
  // }else if(lang==='ar'){
  //   document.dir='rtl';
  // }
  //  }
   changLang(lang:string){
    //set lang in localstorage
    localStorage.setItem('lang',lang);
    //set defualte lang
    this._translate.setDefaultLang(lang);
    //set use lang
    this._translate.use(lang);
    //call dir method
    // this.changeDirection(lang);
   }
}
