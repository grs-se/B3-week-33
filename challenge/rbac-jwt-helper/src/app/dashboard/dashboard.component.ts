import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>📊 Dashboard</h2>
    <p>You are logged in as: {{ userRole }}</p>
    
    @if (userRole === 'admin') {
      <div>
        <button>🗑️ Delete User</button>
      </div>
    }
    
    @if (userRole === 'user') {
      <div>
        <p>👤 Welcome regular user!</p>
      </div>
    }
    `,
  standalone: true
})
export class DashboardComponent implements OnInit {
  userRole = '';

  constructor(private jwtHelper: JwtHelperService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.userRole = decoded?.role || '';
    }
  }
}