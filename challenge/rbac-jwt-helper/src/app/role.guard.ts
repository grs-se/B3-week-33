import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const roleGuard: CanActivateFn = (route, state) => {
  const jwtHelper = inject(JwtHelperService);
  const token = localStorage.getItem('token');
  if (token) {
    const payload = jwtHelper.decodeToken(token);
    return payload?.role === 'admin';
  }
  return false;
};
