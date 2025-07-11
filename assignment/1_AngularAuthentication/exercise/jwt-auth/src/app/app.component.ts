import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    🔐 JWT Login with API Key
    
    <!-- Login form shown only if not logged in -->
    @if (!loggedIn) {
      <div>
        <input [(ngModel)]="email" placeholder="Email" />
        <input [(ngModel)]="password" placeholder="Password" type="password" />
        <button (click)="login()">Login</button>
      </div>
    }
    
    @if (loggedIn) {
      <div>
        <p>✅ Logged in!</p>
        <button (click)="getUsers()">Get Users</button>
      </div>
    }
    
    @if (users.length) {
      <ul>
        @for (user of users; track user) {
          <li>
            👤 {{ user.first_name }} {{ user.last_name }}
          </li>
        }
      </ul>
    }
    
    <p>{{ message }}</p>
    `,
})
export class AppComponent {
  email = 'eve.holt@reqres.in';
  password = 'cityslicka';

  loggedIn = false;
  users: any[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  login() {
    this.http
      .post<{ token: string }>('https://reqres.in/api/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.loggedIn = true;
          this.message = 'Login successful!';
        },
        error: () => {
          this.message = 'Login failed.';
        },
      });
  }

  getUsers() {
    this.http
      .get<{ data: any }>('https://reqres.in/api/users?page=1')
      .subscribe({
        next: (res) => {
          this.users = res.data;
          this.message = '';
        },
        error: () => {
          this.message = 'Failed to fetch users.';
        },
      });
  }
}
