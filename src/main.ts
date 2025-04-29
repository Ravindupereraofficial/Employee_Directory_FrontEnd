import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <h1>Employee Management</h1>
        </div>
        <nav class="nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a 
                routerLink="/employees" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{exact: true}"
                class="nav-link"
              >
                Employees
              </a>
            </li>
            <li class="nav-item">
              <a 
                routerLink="/employees/new" 
                routerLinkActive="active" 
                class="nav-link add-button"
              >
                Add Employee
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #3366FF;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .nav-list {
      display: flex;
      gap: 16px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
    }

    .add-button {
      background-color: #FF9800;
      color: white;
    }

    .add-button:hover {
      background-color: #F57C00;
    }

    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        padding: 16px;
      }

      .logo {
        margin-bottom: 12px;
      }

      .nav-list {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HeaderComponent {}