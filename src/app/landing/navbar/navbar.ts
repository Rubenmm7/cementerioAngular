import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  irAInicio(): void {
    // Navegamos a la raíz
    this.router.navigate(['/']).then(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const userRole = this.authService.getUserRole();
      this.isAdmin = userRole === 'ROLE_SUPERADMIN';
    }
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    // Recargar la página para actualizar el navbar
    window.location.reload();
  }
}
