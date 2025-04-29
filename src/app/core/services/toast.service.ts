import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  private nextId = 0;

  getToasts(): Observable<Toast[]> {
    return this.toasts.asObservable();
  }

  showSuccess(message: string, duration: number = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  showError(message: string, duration: number = 5000): void {
    this.show({ message, type: 'error', duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show({ message, type: 'info', duration });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.show({ message, type: 'warning', duration });
  }

  private show(toast: Omit<Toast, 'id'>): void {
    const id = this.nextId++;
    const newToast = { ...toast, id };
    
    this.toasts.next([...this.toasts.value, newToast]);
    
    if (toast.duration) {
      setTimeout(() => this.remove(id), toast.duration);
    }
  }

  remove(id: number): void {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast.id !== id));
  }
}