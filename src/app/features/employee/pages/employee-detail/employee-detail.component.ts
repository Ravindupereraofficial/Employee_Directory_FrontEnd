import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Employee, departmentColors } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ConfirmDialogComponent],
  template: `
    <div class="detail-container">
      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading employee details...</p>
        </div>
      } @else if (employee) {
        <div 
          class="detail-card"
          [style.borderTop]="'4px solid ' + getDepartmentColor()"
        >
          <div class="card-header">
            <h1 class="employee-name">{{ employee.name }}</h1>
            <div class="header-actions">
              <a [routerLink]="['/employees/edit', employee.id]" class="edit-button">Edit</a>
              <button (click)="confirmDelete()" class="delete-button">Delete</button>
            </div>
          </div>

          <div class="detail-content">
            <div class="detail-row">
              <div class="detail-label">Email</div>
              <div class="detail-value">{{ employee.email }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Department</div>
              <div class="detail-value">
                <span 
                  class="department-badge" 
                  [style.backgroundColor]="getDepartmentColor()"
                >
                  {{ employee.department }}
                </span>
              </div>
            </div>

            @if (employee.createdTime) {
              <div class="detail-row">
                <div class="detail-label">Created</div>
                <div class="detail-value">{{ employee.createdTime | date:'medium' }}</div>
              </div>
            }

            @if (employee.updatedTime) {
              <div class="detail-row">
                <div class="detail-label">Last Updated</div>
                <div class="detail-value">{{ employee.updatedTime | date:'medium' }}</div>
              </div>
            }
          </div>

          <div class="back-link-container">
            <a routerLink="/employees" class="back-link">← Back to Employees</a>
          </div>
        </div>
      } @else {
        <div class="error-state">
          <p>Employee not found</p>
          <a routerLink="/employees" class="back-link">Back to Employees</a>
        </div>
      }
    </div>

    <app-confirm-dialog
      [isOpen]="showDeleteConfirm"
      title="Confirm Deletion"
      [message]="deleteConfirmMessage"
      confirmText="Delete"
      cancelText="Cancel"
      [isDestructive]="true"
      (confirm)="deleteEmployee()"
      (cancel)="cancelDelete()"
    ></app-confirm-dialog>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .detail-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
    }

    .employee-name {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .edit-button, .delete-button {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .edit-button {
      background-color: #3366FF;
      color: white;
      border: none;
    }

    .edit-button:hover {
      background-color: #2952cc;
    }

    .delete-button {
      background-color: #F44336;
      color: white;
      border: none;
    }

    .delete-button:hover {
      background-color: #d32f2f;
    }

    .detail-content {
      padding: 24px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 16px;
      align-items: center;
    }

    .detail-label {
      width: 120px;
      font-weight: 500;
      color: #757575;
    }

    .detail-value {
      flex: 1;
      color: #333;
    }

    .department-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 500;
      color: white;
    }

    .back-link-container {
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
    }

    .back-link {
      color: #3366FF;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: #2952cc;
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      text-align: center;
      color: #757575;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(51, 102, 255, 0.1);
      border-left-color: #3366FF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        margin-top: 16px;
        width: 100%;
      }

      .edit-button, .delete-button {
        flex: 1;
        text-align: center;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-label {
        width: 100%;
        margin-bottom: 4px;
      }
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);
  
  employee: Employee | null = null;
  loading = true;
  employeeId?: number;
  
  // For delete confirmation
  showDeleteConfirm = false;
  deleteConfirmMessage = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['id'];
      this.loadEmployee();
    });
  }

  loadEmployee(): void {
    if (!this.employeeId) return;
    
    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.employee = null;
        this.toastService.showError('Employee not found');
      }
    });
  }

  getDepartmentColor(): string {
    if (!this.employee) return '#999999';
    return departmentColors[this.employee.department] || '#999999';
  }

  confirmDelete(): void {
    if (!this.employee) return;
    
    this.deleteConfirmMessage = `Are you sure you want to delete ${this.employee.name}? This action cannot be undone.`;
    this.showDeleteConfirm = true;
  }

  deleteEmployee(): void {
    if (!this.employee || !this.employee.id) return;
    
    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        this.toastService.showSuccess(`${this.employee!.name} deleted successfully`);
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.toastService.showError('Failed to delete employee');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}