🔐 Angular Challenge: Role-Based Access Using JWT Helper
============================================================================================

🎯 Goal:
--------

*   Protect routes using `CanActivate`.
*   Use a JWT helper library to decode the token and check user roles.
*   Control UI content visibility based on role (admin, user).

🔧 Prerequisites:
-----------------

Install the JWT helper library:

    npm install @auth0/angular-jwt

📦 What You'll Build:
---------------------

*   A login flow that stores a JWT token (simulated) with a role.
*   An AuthGuard that:
    *   Checks if the user is logged in.
    *   Uses JwtHelperService to decode and check role.
*   A dashboard accessible only to logged-in users.
*   An admin-only section visible only to users with admin role.

🧭 Step-by-Step Instructions
----------------------------

### 1\. Configure JWT Helper (`app.module.ts`)

    import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
    
    @NgModule({
      providers: [
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
      ]
    })
    export class AppModule {}

### 2\. Create Auth Guard (`auth.guard.ts`)

    import { Injectable } from '@angular/core';
    import { CanActivate, Router } from '@angular/router';
    import { JwtHelperService } from '@auth0/angular-jwt';
    
    @Injectable({ providedIn: 'root' })
    export class AuthGuard implements CanActivate {
      constructor(private jwtHelper: JwtHelperService, private router: Router) {}
    
      canActivate(): boolean {
        const token = localStorage.getItem('token');
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }
    }

### 3\. Create Role Guard (`role.guard.ts`)

    import { Injectable } from '@angular/core';
    import { CanActivate } from '@angular/router';
    import { JwtHelperService } from '@auth0/angular-jwt';
    
    @Injectable({ providedIn: 'root' })
    export class RoleGuard implements CanActivate {
      constructor(private jwtHelper: JwtHelperService) {}
    
      canActivate(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = this.jwtHelper.decodeToken(token);
          return payload?.role === 'admin';
        }
        return false;
      }
    }

### 4\. Setup Routes with Guards (`app.routes.ts`)

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

### 5\. Login Component (`login.component.ts`)

    import { Component } from '@angular/core';
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
        const token = this.createFakeJwt(this.role);
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      }
    
      createFakeJwt(role: string): string {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ role, exp: Math.floor(Date.now() / 1000) + 60 * 60 }));
        const signature = 'mock-signature';
        return `${header}.${payload}.${signature}`;
      }
    }

### 6\. Dashboard with Role-Based UI (`dashboard.component.ts`)

    import { Component, OnInit } from '@angular/core';
    import { JwtHelperService } from '@auth0/angular-jwt';
    
    @Component({
      selector: 'app-dashboard',
      template: `
        <h2>📊 Dashboard</h2>
        <p>You are logged in as: {{ userRole }}</p>
    
        <div *ngIf="userRole === 'admin'">
          <button>🗑️ Delete User</button>
        </div>
    
        <div *ngIf="userRole === 'user'">
          <p>👤 Welcome regular user!</p>
        </div>
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

🧠 What You Learn:
------------------

*   How to decode JWTs using a helper library.
*   How to protect routes using `CanActivate`.
*   How to enforce role-based routing and UI logic.
*   How to simulate login using a custom token with expiration.

✅ To Test:
----------

*   Run the app and go to `/login`.
*   Enter credentials and select a role.
*   Try accessing:
    *   `/dashboard` (should work for all).
    *   `/admin` (works only for admins).
*   On dashboard:
    *   Admins see the `Delete User` button.
    *   Regular users see a welcome message.

### Happy Coding!