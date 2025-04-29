import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, Department } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-card">
        <h1 class="form-title">{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>

        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading employee data...</p>
          </div>
        } @else {
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="form-control"
                [class.error]="isFieldInvalid('name')"
              >
              @if (isFieldInvalid('name')) {
                <div class="error-message">Name is required</div>
              }
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="form-control"
                [class.error]="isFieldInvalid('email')"
              >
              @if (isFieldInvalid('email')) {
                <div class="error-message">
                  @if (getFieldError('email', 'required')) {
                    Email is required
                  } @else if (getFieldError('email', 'email')) {
                    Please enter a valid email address
                  }
                </div>
              }
            </div>

            <div class="form-group">
              <label for="department">Department</label>
              <select 
                id="department" 
                formControlName="department"
                class="form-control"
                [class.error]="isFieldInvalid('department')"
              >
                <option value="" disabled>Select Department</option>
                @for (dept of departmentOptions; track dept) {
                  <option [value]="dept">{{ dept }}</option>
                }
              </select>
              @if (isFieldInvalid('department')) {
                <div class="error-message">Department is required</div>
              }
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="cancel-button" 
                (click)="onCancel()"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="submit-button"
                [disabled]="employeeForm.invalid || submitting"
              >
                {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 24px;
    }

    .form-title {
      margin: 0 0 24px;
      color: #333;
      font-size: 1.5rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-control:focus {
      border-color: #3366FF;
      outline: none;
      box-shadow: 0 0 0 3px rgba(51, 102, 255, 0.1);
    }

    .form-control.error {
      border-color: #F44336;
    }

    .error-message {
      color: #F44336;
      font-size: 0.85rem;
      margin-top: 6px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
    }

    button {
      padding: 12px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      border: none;
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #666;
    }

    .cancel-button:hover {
      background-color: #e0e0e0;
    }

    .submit-button {
      background-color: #3366FF;
      color: white;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #2952cc;
    }

    .submit-button:disabled {
      background-color: #a0b4ff;
      cursor: not-allowed;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 0;
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
  `]
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  employeeForm!: FormGroup;
  departmentOptions = Object.values(Department);
  isEditMode = false;
  employeeId?: number;
  loading = false;
  submitting = false;

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.loadEmployeeData();
      }
    });
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });
  }

  loadEmployeeData(): void {
    if (!this.employeeId) return;
    
    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.showError('Failed to load employee data');
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formData = this.employeeForm.value as Employee;
    this.submitting = true;

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, formData).subscribe({
        next: (employee) => {
          this.toastService.showSuccess(`${employee.name} updated successfully`);
          this.router.navigate(['/employees', employee.id]);
          this.submitting = false;
        },
        error: () => {
          this.toastService.showError('Failed to update employee');
          this.submitting = false;
        }
      });
    } else {
      this.employeeService.createEmployee(formData).subscribe({
        next: (employee) => {
          this.toastService.showSuccess(`${employee.name} created successfully`);
          this.router.navigate(['/employees']);
          this.submitting = false;
        },
        error: () => {
          this.toastService.showError('Failed to create employee');
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.employeeId) {
      this.router.navigate(['/employees', this.employeeId]);
    } else {
      this.router.navigate(['/employees']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return field ? field.hasError(errorType) : false;
  }
}