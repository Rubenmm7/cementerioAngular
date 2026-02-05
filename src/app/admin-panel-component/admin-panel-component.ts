import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-admin-panel-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-panel-component.html',
  styleUrl: './admin-panel-component.css',
})
export class AdminPanelComponent implements OnInit {
  sidebarOpen = false;
  userRole: string = '';
  currentUser = 'Super Admin';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    if (this.userRole !== 'SUPER_ADMIN') {
      this.router.navigate(['/']);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigate(path: string): void {
    this.router.navigate(['/admin', path]);
    this.sidebarOpen = false;
  }
}
