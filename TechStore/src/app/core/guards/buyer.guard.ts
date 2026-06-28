import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * BuyerGuard
 * Allows access only to users with 'buyer' role
 */
export const buyerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const userRole = authService.getUserRole();

    if (userRole === 'buyer') {
        return true;
    }

    router.navigate(['/']);
    return false;
};
