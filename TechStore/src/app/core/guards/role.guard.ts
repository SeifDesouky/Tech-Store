import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is logged in
    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data['roles'] as Array<string>;

    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    // Check if user has required role
    const userRole = authService.getUserRole();

    if (userRole && requiredRoles.includes(userRole)) {
        return true;
    } else {
        // Redirect to unauthorized page or home
        router.navigate(['/']);
        alert('Access Denied: You do not have permission to access this page');
        return false;
    }
};
