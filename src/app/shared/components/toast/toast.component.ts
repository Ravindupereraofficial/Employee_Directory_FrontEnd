import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../core/services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div 
          class="toast" 
          [class]="toast.type"
          [@toastAnimation]
          (click)="removeToast(toast.id)"
        >
          <div class="toast-content">
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="removeToast(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 350px;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      color: white;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .toast-content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .toast-message {
      margin: 0;
      font-size: 0.9rem;
    }

    .toast-close {
      background: none;
      border: none;
      color: white;
      opacity: 0.7;
      cursor: pointer;
      font-size: 1rem;
      margin-left: 8px;
      padding: 0;
    }

    .toast-close:hover {
      opacity: 1;
    }

    .success {
      background-color: #4CAF50;
    }

    .error {
      background-color: #F44336;
    }

    .info {
      background-color: #2196F3;
    }

    .warning {
      background-color: #FF9800;
    }

    @media (max-width: 768px) {
      .toast-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  ngOnInit(): void {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}