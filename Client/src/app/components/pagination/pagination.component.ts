import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Page navigation" class="flex justify-center mt-4">
      <ul class="inline-flex items-center -space-x-px">
        <li>
          <button
            [disabled]="currentPage === 1"
            (click)="onPageChange(currentPage - 1)"
            class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="sr-only">Previous</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          </button>
        </li>
        @for (page of pageNumbers; track page) {
          <li>
            <button
              [class.bg-blue-50]="currentPage === page"
              [class.text-blue-600]="currentPage === page"
              [class.border-blue-300]="currentPage === page"
              [class.hover:bg-blue-100]="currentPage === page"
              [class.hover:text-blue-700]="currentPage === page"
              [disabled]="page === '...'"
              (click)="onPageChange(page)"
              class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {{ page }}
            </button>
          </li>
        }
        <li>
          <button
            [disabled]="currentPage === totalPages"
            (click)="onPageChange(currentPage + 1)"
            class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="sr-only">Next</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
          </button>
        </li>
      </ul>
    </nav>
  `
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChange = new EventEmitter<number>();

  get pageNumbers(): (number | string)[] {
    const pageNumbers: (number | string)[] = [];
    const siblingsCount = 1;
    const totalButtons = 7;

    pageNumbers.push(1);

    if (this.totalPages <= totalButtons) {
      for (let i = 2; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let leftSibling = Math.max(this.currentPage - siblingsCount, 2);
      let rightSibling = Math.min(this.currentPage + siblingsCount, this.totalPages - 1);

      const shouldShowLeftDots = leftSibling > 2;
      const shouldShowRightDots = rightSibling < this.totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        leftSibling = 2;
        for (let i = leftSibling; i <= leftSibling + 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        pageNumbers.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages - 1; i++) {
          pageNumbers.push(i);
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        pageNumbers.push('...');
        for (let i = leftSibling; i <= rightSibling; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
      }
    }

    if (pageNumbers[pageNumbers.length - 1] !== this.totalPages) {
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}