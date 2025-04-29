import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/employees', 
    pathMatch: 'full' 
  },
  {
    path: 'employees',
    loadComponent: () => import('./features/employee/pages/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'employees/new',
    loadComponent: () => import('./features/employee/pages/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: 'employees/:id',
    loadComponent: () => import('./features/employee/pages/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent)
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./features/employee/pages/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];