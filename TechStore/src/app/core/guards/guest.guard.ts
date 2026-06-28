import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // If user is already logged in, redirect to home
    if (authService.isLoggedIn()) {
        router.navigate(['/']);
        return false;
    }

    // Allow access to guest routes (login, register, etc.)
    return true;
};
