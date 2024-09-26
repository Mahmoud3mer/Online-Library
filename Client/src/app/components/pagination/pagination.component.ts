import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MyTranslateService } from '../../services/translation/my-translate.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgFor,NgClass,TranslateModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  constructor(private _myTranslateService:MyTranslateService){ }
  @Input() currentPage!: number;
  @Input() totalPages!: number;

  @Output() pageChanged = new EventEmitter<number>();
  handleClick(): void {
    console.log('Button clicked');  // Ensure this logs when button is clicked
  }
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      console.log('Emitting pageChanged event for page:', newPage);
      this.pageChanged.emit(newPage);
    } else {
      console.log('Page out of range:', newPage);
    }
  }
  
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
