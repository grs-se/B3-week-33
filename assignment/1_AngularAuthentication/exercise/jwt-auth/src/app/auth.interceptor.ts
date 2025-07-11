import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
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
  return next(clonedRequest);
};
