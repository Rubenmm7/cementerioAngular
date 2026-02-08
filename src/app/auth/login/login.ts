import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm: FormGroup;
  error = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir al inicio
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

this.isLoading = true;
this.error = '';

const data: LoginRequest = this.loginForm.value; 

this.authService.login(data).subscribe({
  next: (res) => {
    this.authService.saveSession(res);
    if (this.authService.hasRole('ADMIN')) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  },
  error: (err) => {
    this.isLoading = false;
    this.error = 'Credenciales incorrectas';
    console.error(err);
  }

  });
}

}


