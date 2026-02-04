import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './auth/login/login';
import { AdminPanelComponent } from './admin-panel-component/admin-panel-component';
import { authGuardGuard } from './guards/auth-guard-guard';
import { roleGuardGuard } from './guards/role-guard-guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [roleGuardGuard, authGuardGuard],
    data: { role: 'ROLE_SUPERADMIN' }  
  },

  {path : '**', redirectTo: '' }
];
