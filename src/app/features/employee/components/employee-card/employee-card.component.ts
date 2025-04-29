import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee, Department, departmentColors } from '../../../../core/models/employee.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="employee-card" [style.borderTop]="'4px solid ' + getDepartmentColor()">
      <div class="card-header">
        <h3 class="employee-name">{{ employee.name }}</h3>
        <span class="department-badge" [style.backgroundColor]="getDepartmentColor()">
          {{ employee.department }}
        </span>
      </div>
      
      <div class="card-body">
        <p class="employee-email">{{ employee.email }}</p>
        
        @if (employee.createdTime) {
          <p class="timestamp">
            Created: {{ employee.createdTime | date:'medium' }}
          </p>
        }
        
        @if (employee.updatedTime) {
          <p class="timestamp">
            Updated: {{ employee.updatedTime | date:'medium' }}
          </p>
        }
      </div>
      
      <div class="card-actions">
        <a [routerLink]="['/employees', employee.id]" class="view-button">View</a>
        <a [routerLink]="['/employees/edit', employee.id]" class="edit-button">Edit</a>
        <button (click)="onDelete()" class="delete-button">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .employee-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
    }

    .employee-name {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    .department-badge {
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
      color: white;
    }

    .card-body {
      padding: 16px;
    }

    .employee-email {
      margin: 0 0 8px;
      color: #666;
    }

    .timestamp {
      margin: 4px 0;
      font-size: 0.8rem;
      color: #999;
    }

    .card-actions {
      display: flex;
      border-top: 1px solid #f0f0f0;
    }

    .card-actions a, 
    .card-actions button {
      flex: 1;
      padding: 12px;
      text-align: center;
      background: none;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .view-button {
      color: #3366FF;
    }

    .view-button:hover {
      background-color: rgba(51, 102, 255, 0.05);
    }

    .edit-button {
      color: #FF9800;
    }

    .edit-button:hover {
      background-color: rgba(255, 152, 0, 0.05);
    }

    .delete-button {
      color: #F44336;
    }

    .delete-button:hover {
      background-color: rgba(244, 67, 54, 0.05);
    }
  `]
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() delete = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }

  getDepartmentColor(): string {
    return departmentColors[this.employee.department] || '#999999';
  }
}