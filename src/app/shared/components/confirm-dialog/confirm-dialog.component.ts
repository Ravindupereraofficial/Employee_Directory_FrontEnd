import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-backdrop" *ngIf="isOpen" (click)="onCancelClick()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <h2 class="dialog-title">{{ title }}</h2>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button 
            class="cancel-button" 
            (click)="onCancelClick()"
          >
            {{ cancelText }}
          </button>
          <button 
            class="confirm-button" 
            [class.destructive]="isDestructive"
            (click)="onConfirmClick()"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .dialog-container {
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.2s ease-out;
    }

    .dialog-title {
      margin: 0 0 16px;
      font-size: 1.25rem;
      color: #333;
    }

    .dialog-message {
      margin: 0 0 24px;
      color: #666;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    button {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #666;
    }

    .cancel-button:hover {
      background-color: #e0e0e0;
    }

    .confirm-button {
      background-color: #3366FF;
      color: white;
    }

    .confirm-button:hover {
      background-color: #2952cc;
    }

    .confirm-button.destructive {
      background-color: #F44336;
    }

    .confirm-button.destructive:hover {
      background-color: #d32f2f;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() isDestructive = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirmClick(): void {
    this.confirm.emit();
    this.isOpen = false;
  }

  onCancelClick(): void {
    this.cancel.emit();
    this.isOpen = false;
  }
}