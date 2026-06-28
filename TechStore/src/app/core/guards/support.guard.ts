import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * SupportGuard
 * Allows access to users with 'support' or 'admin' role (since admins usually oversee support)
 */
export const supportGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const userRole = authService.getUserRole();

    if (userRole === 'support' || userRole === 'admin') {
        return true;
    }

    router.navigate(['/']);
    return false;
};
