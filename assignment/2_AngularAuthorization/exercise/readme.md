🚦 Angular Challenge: Route Protection with CanActivate + Role-Based Access Control
===================================================================================

🎯 Goal
-------

Build an Angular app where routes are protected using `CanActivate` guards, and user roles from a JWT token determine access levels both on routes and UI.

🧩 What You'll Build
--------------------

*   A login flow that stores a JWT token containing the user’s role (admin or user).
*   A route guard (**AuthGuard**) that:
    *   Checks for login (JWT token).
    *   Verifies if the user's role matches required access.
*   A dashboard page only accessible by authenticated users.
*   Admin-only sections/buttons that are shown/hidden based on the user’s role.

🛠️ Step-by-Step Instructions
-----------------------------

### 1\. Create Auth Guard (`auth.guard.ts`)

    import { Injectable } from '@angular/core';
    import { CanActivate, Router } from '@angular/router';
    
    @Injectable({ providedIn: 'root' })
    export class AuthGuard implements CanActivate {
      constructor(private router: Router) {}
    
      canActivate(): boolean {
        const token = localStorage.getItem('token');
    
        if (token) {
          return true;
        }
    
        this.router.navigate(['/login']);
        return false;
      }
    }

### 2\. Create Role Guard (Optional) (`role.guard.ts`)

    import { Injectable } from '@angular/core';
    import { CanActivate } from '@angular/router';
    
    @Injectable({ providedIn: 'root' })
    export class RoleGuard implements CanActivate {
      canActivate(): boolean {
        const token = localStorage.getItem('token');
    
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.role === 'admin';
        }
    
        return false;
      }
    }

### 3\. Add Routes with Guards (`app-routing.module.ts`)

    import { Routes } from '@angular/router';
    import { LoginComponent } from './login.component';
    import { DashboardComponent } from './dashboard.component';
    import { AdminPanelComponent } from './admin.component';
    import { AuthGuard } from './auth.guard';
    import { RoleGuard } from './role.guard';
    
    export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ];

### 4\. Login Component – Store JWT with Role (`login.component.ts`)

    import { Component } from '@angular/core';
    import { Router } from '@angular/router';
    
    @Component({
      selector: 'app-login',
      template: \`
        <h2>🔐 Login</h2>
        <input [(ngModel)]="email" placeholder="Email" />
        <input [(ngModel)]="password" placeholder="Password" type="password" />
        <select [(ngModel)]="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button (click)="login()">Login</button>
      \`,
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
        return \`header.\${payload}.signature\`;
      }
    }

### 5\. Dashboard Component – UI Role-Based Access (`dashboard.component.ts`)

    import { Component, OnInit } from '@angular/core';
    
    @Component({
      selector: 'app-dashboard',
      template: \`
        <h2>📊 Dashboard</h2>
        <p>Welcome! You are logged in as: {{ userRole }}</p>
    
        <div *ngIf="userRole === 'admin'">
          <button>🗑️ Delete User</button>
        </div>
    
        <div *ngIf="userRole === 'user'">
          <p>👤 Regular user dashboard</p>
        </div>
      \`,
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

🔐 What This Teaches
--------------------

*   How to protect routes using `CanActivate` route guards.
*   How to decode a JWT and extract the role from its payload.
*   How to use multiple guards to combine login + role protection.
*   How to show/hide UI sections (buttons, panels) based on user roles.

✅ To Test:
----------

1.  Run the Angular app.
2.  Go to `/login`, enter credentials, and select a role.
3.  Click Login – a fake JWT is stored with role info.
4.  Try accessing:
    *   `/dashboard` → accessible if logged in.
    *   `/admin` → accessible only if role = admin.
5.  Check the UI: Admins will see the Delete User button, regular users won’t.

### Happy Coding!