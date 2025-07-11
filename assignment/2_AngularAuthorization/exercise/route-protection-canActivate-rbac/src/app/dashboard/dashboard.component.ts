import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>📊 Dashboard</h2>
    <p>Welcome! You are logged in as: {{ userRole }}</p>
    
    @if (userRole === 'admin') {
      <div>
        <button>🗑️ Delete User</button>
      </div>
    }
    
    @if (userRole === 'user') {
      <div>
        <p>👤 Regular user dashboard</p>
      </div>
    }
    `,
  standalone: true,
})
export class DashboardComponent implements OnInit {
  userRole: string = 'user';

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
    }
  }
}
