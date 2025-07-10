import { Component, inject, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts',
  imports: [NgbToastModule, NgTemplateOutlet, CommonModule],
  template: `
    @for (toast of toastService.toasts(); track toast) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        <ng-container *ngIf="isTemplate(toast.message); else plain">
          <ng-template [ngTemplateOutlet]="toast.message"></ng-template>
        </ng-container>
        <ng-template #plain>
          {{ toast.message }}
        </ng-template>
      </ngb-toast>
    }
  `,
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
  standalone: true,
})
export class ToastsContainer {
  toastService = inject(ToastService);

  isTemplate(msg: string | TemplateRef<any>): msg is TemplateRef<any> {
    return msg instanceof TemplateRef;
  }
}

