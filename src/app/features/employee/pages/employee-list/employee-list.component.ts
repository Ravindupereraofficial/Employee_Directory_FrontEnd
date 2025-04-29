import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Employee, Department } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { ToastService } from '../../../../core/services/toast.service';
import { EmployeeCardComponent } from '../../components/employee-card/employee-card.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    EmployeeCardComponent,
    ConfirmDialogComponent
  ],
  template: `
    <div class="employee-list-container">
      <header class="page-header">
        <h1>Employees</h1>
        <a routerLink="/employees/new" class="add-button">Add Employee</a>
      </header>

      <div class="filters">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            class="search-input"
          />
        </div>
        
        <div class="department-filter">
          <label for="department-select">Department:</label>
          <select 
            id="department-select" 
            [(ngModel)]="selectedDepartment"
            (change)="applyFilters()"
            class="department-select"
          >
            <option value="">All Departments</option>
            @for (dept of departmentOptions; track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
        </div>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading employees...</p>
        </div>
      } @else if (filteredEmployees.length === 0) {
        <div class="empty-state">
          @if (searchTerm || selectedDepartment) {
            <p>No employees found matching your filters.</p>
            <button (click)="clearFilters()" class="clear-filters-button">
              Clear Filters
            </button>
          } @else {
            <p>No employees found. Add your first employee to get started.</p>
            <a routerLink="/employees/new" class="add-button">Add Employee</a>
          }
        </div>
      } @else {
        <div class="employee-grid">
          @for (employee of filteredEmployees; track employee.id) {
            <app-employee-card 
              [employee]="employee" 
              (delete)="confirmDelete(employee)"
            ></app-employee-card>
          }
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
    .employee-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      color: #333;
      font-size: 1.75rem;
    }

    .add-button {
      display: inline-block;
      padding: 10px 16px;
      background-color: #3366FF;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background-color: #2952cc;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-container {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      width: 100%;
      padding: 10px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: #3366FF;
      outline: none;
    }

    .department-filter {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .department-select {
      padding: 10px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      min-width: 150px;
    }

    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .loading-state, .empty-state {
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

    .clear-filters-button {
      margin-top: 16px;
      padding: 8px 16px;
      background-color: #f5f5f5;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clear-filters-button:hover {
      background-color: #e0e0e0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .employee-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
      }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);
  
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = true;
  searchTerm = '';
  selectedDepartment = '';
  departmentOptions = Object.values(Department);
  
  // For delete confirmation
  showDeleteConfirm = false;
  employeeToDelete: Employee | null = null;
  deleteConfirmMessage = '';

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = [...employees];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.showError('Failed to load employees');
      }
    });
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = !this.selectedDepartment || 
        employee.department === this.selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.filteredEmployees = [...this.employees];
  }

  confirmDelete(employee: Employee): void {
    this.employeeToDelete = employee;
    this.deleteConfirmMessage = `Are you sure you want to delete ${employee.name}? This action cannot be undone.`;
    this.showDeleteConfirm = true;
  }

  deleteEmployee(): void {
    if (!this.employeeToDelete || !this.employeeToDelete.id) return;
    
    this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== this.employeeToDelete!.id);
        this.applyFilters();
        this.toastService.showSuccess(`${this.employeeToDelete!.name} deleted successfully`);
        this.employeeToDelete = null;
      },
      error: () => {
        this.toastService.showError('Failed to delete employee');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
  }
}