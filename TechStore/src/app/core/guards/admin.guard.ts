import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is logged in
    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    // Check if user has admin role
    const userRole = authService.getUserRole();

    if (userRole === 'admin') {
        return true;
    } else {
        router.navigate(['/']);
        alert('Access Denied: Admin privileges required');
        return false;
    }
};
