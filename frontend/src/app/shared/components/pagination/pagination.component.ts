import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() perPage: number = 5;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() perPageChange: EventEmitter<number> = new EventEmitter<number>();

  perPageFormControl = new FormControl(this.perPage, { nonNullable: true });

  ngOnInit(): void {
    this.perPageFormControl.setValue(this.perPage, { emitEvent: false });

    this.perPageFormControl.valueChanges.subscribe((newPerPage) => {
      this.perPageChange.emit(newPerPage);
    })

  }

  get pages(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const showLeftEllipsis = this.currentPage > 4;
      const showRightEllipsis = this.currentPage < this.totalPages - 3;

      pages.push(1); // Always show first page

      if (showLeftEllipsis) {
        pages.push('...');
      }

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (showRightEllipsis) {
        pages.push('...');
      }

      pages.push(this.totalPages); // Always show last page
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
