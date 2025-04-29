export interface Employee {
  id?: number;
  name: string;
  email: string;
  department: Department;
  createdTime?: string;
  updatedTime?: string;
}

export enum Department {
  HR = 'HR',
  IT = 'IT',
  FINANCE = 'FINANCE',
  OPERATIONS = 'OPERATIONS'
}

export const departmentColors = {
  [Department.HR]: '#4CAF50',
  [Department.IT]: '#3366FF', 
  [Department.FINANCE]: '#FF9800',
  [Department.OPERATIONS]: '#673AB7'
};