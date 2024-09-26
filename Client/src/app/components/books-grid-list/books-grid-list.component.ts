import { Component, Input } from "@angular/core";
import { BookCardComponent } from "../book-card/book-card.component";
import { BookInterface } from "../../interfaces/books.interface";
import { MyTranslateService } from "../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-books-grid-list",
  standalone: true,
  imports: [BookCardComponent,TranslateModule],
  templateUrl: "./books-grid-list.component.html",
  styleUrl: "./books-grid-list.component.scss",
})
export class BooksGridListComponent {
  @Input() allBooks: Array<BookInterface> = [];
constructor(private _myTranslateService:MyTranslateService){ }
  
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
