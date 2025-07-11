import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  }

  return false;
};
