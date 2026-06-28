import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request: Invalid data submitted';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in again';
            authService.logout();
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Access Denied: You do not have permission';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict: Resource already exists';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation Error: Please check your input';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Please try again later';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Server is temporarily down';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Log error to console for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        error: error.error
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
