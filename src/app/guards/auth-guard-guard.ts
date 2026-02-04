import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth';

export const authGuardGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si no estas logeado, te redirige al login
  if(!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
  }
      return true;
};
