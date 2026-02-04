import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth';

export const roleGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'];

  if (!authService.hasRole(requiredRole)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
