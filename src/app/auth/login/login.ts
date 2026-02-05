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

    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        // Guardar datos del usuario si existen en la respuesta
        if (res.usuario) {
          localStorage.setItem('userData', JSON.stringify(res.usuario));
        }
        // Guardar roles si existen en la respuesta
        if (res.roles) {
          localStorage.setItem('roles', JSON.stringify(res.roles));
        }
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
