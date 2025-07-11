🔐 Angular Challenge: JWT Authentication with API Key using HttpClient + Interceptor
====================================================================================

Goal:
-----

Create a simple Angular app where a user can **log in using a public API**, store the JWT token, and use an **HTTP interceptor** to attach the JWT token and an **API key** to all outgoing HTTP requests automatically.

What You'll Build:
------------------

*   A **Login Form** that authenticates using ReqRes API and stores the JWT token.
*   A shared **HttpInterceptor** that:
    *   Attaches the JWT token to the `Authorization` header.
    *   Attaches a static `x-api-key` header to every request.
*   A **"Get Users" button** that fetches users using the stored token + API key.
*   A simple UI to display the list of users fetched from the API.

Step-by-Step Instructions
-------------------------

### 1\. Create the Interceptor (`auth.interceptor.ts`):

    
    import { Injectable } from '@angular/core';
    import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
    
    @Injectable()
    export class AuthInterceptor implements HttpInterceptor {
      intercept(req: HttpRequest, next: HttpHandler) {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');
    
        // Always add the static API key header
        let headers = req.headers.set('x-api-key', 'reqres-free-v1');
    
        // If token exists, add Authorization header with Bearer token
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
    
        // Clone the request and attach the new headers
        const clonedRequest = req.clone({ headers });
    
        // Pass the cloned request to the next handler in the chain
        return next.handle(clonedRequest);
      }
    }
      

### 2\. Create the App Component (`app.component.ts`):

    
    import { Component } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    
    @Component({
      selector: 'app-root',
      template: `
        🔐 JWT Login with API Key
    
        <!-- Login form shown only if not logged in -->
        <div *ngIf="!loggedIn">
          <input [(ngModel)]="email" placeholder="Email" />
          <input [(ngModel)]="password" placeholder="Password" type="password" />
          <button (click)="login()">Login</button>
        </div>
    
        <div *ngIf="loggedIn">
          <p>✅ Logged in!</p>
          <button (click)="getUsers()">Get Users</button>
        </div>
    
        <ul *ngIf="users.length">
          <li *ngFor="let user of users">
            👤 {{ user.first_name }} {{ user.last_name }}
          </li>
        </ul>
    
        <p>{{ message }}</p>
      `,
      standalone: true,
      imports: [HttpClient, FormsModule],
    })
    export class AppComponent {
      email = 'eve.holt@reqres.in';
      password = 'cityslicka';
    
      loggedIn = false;
      users: any[] = [];
      message = '';
    
      constructor(private http: HttpClient) {}
    
      login() {
        this.http.post('https://reqres.in/api/login', {
          email: this.email,
          password: this.password
        }).subscribe({
          next: res => {
            localStorage.setItem('token', res.token);
            this.loggedIn = true;
            this.message = 'Login successful!';
          },
          error: () => {
            this.message = 'Login failed.';
          }
        });
      }
    
      getUsers() {
        this.http.get('https://reqres.in/api/users?page=1').subscribe({
          next: res => {
            this.users = res.data;
            this.message = '';
          },
          error: () => {
            this.message = 'Failed to fetch users.';
          }
        });
      }
    }
      

### 3\. Register the Interceptor

#### If using `AppModule`:

    
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
    import { FormsModule } from '@angular/forms';
    import { AppComponent } from './app.component';
    import { AuthInterceptor } from './auth.interceptor';
    
    @NgModule({
      declarations: [AppComponent],
      imports: [BrowserModule, HttpClientModule, FormsModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ],
      bootstrap: [AppComponent],
    })
    export class AppModule {}
      

#### If using `main.ts` for standalone:

    
    import { bootstrapApplication } from '@angular/platform-browser';
    import { AppComponent } from './app/app.component';
    import { provideHttpClient, withInterceptors } from '@angular/common/http';
    import { importProvidersFrom } from '@angular/core';
    import { FormsModule } from '@angular/forms';
    
    import { AuthInterceptor } from './app/auth.interceptor';
    
    bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(FormsModule),
        provideHttpClient(withInterceptors([() => new AuthInterceptor()]))
      ]
    });
      

What This Teaches:
------------------

*   How to **authenticate a user with a real API** and receive a token.
*   How to **store and retrieve JWT tokens** from localStorage.
*   How to use an **HttpInterceptor** to:
    *   Add `Authorization` headers to all requests
    *   Attach a static API key header (`x-api-key`)
*   How to create secure, shared HTTP logic using interceptors.

To Test:
--------

1.  Run the app.
2.  Use credentials:
    *   Email: `eve.holt@reqres.in`
    *   Password: `cityslicka`
3.  Click **Login**. You should see "Login successful!".
4.  Click **Get Users**. The token and API key will be sent automatically via the interceptor.
5.  User list is displayed.

### Happy Coding!