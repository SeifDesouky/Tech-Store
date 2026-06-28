import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * SellerGuard
 * Allows access only to users with 'seller' role
 */
export const sellerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check authentication first
    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    // Check for seller role (or admin/support if they should have access - assuming restricted to seller based on prompt)
    const userRole = authService.getUserRole();

    // Note: Admins often have access to everything, but stricly following prompt: "allows only seller"
    // If you want admins to also access seller routes, use: if (userRole === 'seller' || userRole === 'admin')
    if (userRole === 'seller') {
        return true;
    }

    // Redirect to home or specialized 403 page
    router.navigate(['/']);
    return false;
};
