import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <h2>🔐 Login</h2>
    <input [(ngModel)]="email" placeholder="Email" />
    <input [(ngModel)]="password" placeholder="Password" type="password" />
    <select [(ngModel)]="role">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
    <button (click)="login()">Login</button>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';
  role: 'user' | 'admin' = 'user';

  constructor(private router: Router) {}

  login() {
    const token = this.createFakeToken(this.role);
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard']);
  }

  createFakeToken(role: string): string {
    const payload = btoa(JSON.stringify({ role }));
    return `header.${payload}.signature`;
  }
}
