import { Injectable, signal, TemplateRef } from '@angular/core';

export interface Toast {
  message: string | TemplateRef<any>;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(toast: Toast) {
    this._toasts.update((toasts) => [...toasts, toast]);
  }

  success(message: string) {
    this.show({ message, classname: 'bg-success text-light', delay: 3000 });
  }

  error(message: string) {
    this.show({ message, classname: 'bg-danger text-light', delay: 5000 });
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this._toasts.set([]);
  }
}
