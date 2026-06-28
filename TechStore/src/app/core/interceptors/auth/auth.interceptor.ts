import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Endpoints that don't need authentication
  // Endpoints that should NOT receive a token (typically auth endpoints)
  const publicEndpoints = [
    '/api/users/login',
    '/api/users/register',
    '/api/users/social-login',
  ];

  // Check if current request URL matches any public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  if (token && !isPublicEndpoint) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};
