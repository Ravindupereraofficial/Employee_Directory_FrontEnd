import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/" class="home-link">Go to Homepage</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      height: 60vh;
    }

    h1 {
      font-size: 6rem;
      margin: 0;
      color: #3366FF;
    }

    h2 {
      font-size: 2rem;
      margin: 8px 0 16px;
      color: #333;
    }

    p {
      margin-bottom: 24px;
      color: #757575;
    }

    .home-link {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3366FF;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .home-link:hover {
      background-color: #2952cc;
    }
  `]
})
export class NotFoundComponent {}