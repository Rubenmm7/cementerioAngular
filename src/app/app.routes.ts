import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './auth/login/login';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersManagementComponent } from './admin/users-management/users-management.component';
import { CementeriosManagementComponent } from './admin/cementerios-management/cementerios-management.component';
import { DeceasedManagementComponent } from './admin/deceased-management/deceased-management.component';
import { ReportsComponent } from './admin/reports/reports.component';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersManagementComponent },
      { path: 'cemeteries', component: CementeriosManagementComponent },
      { path: 'deceased', component: DeceasedManagementComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
