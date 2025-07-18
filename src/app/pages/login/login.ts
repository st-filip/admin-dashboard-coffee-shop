import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password } = this.form.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          this.error = 'JWT token not found';
          this.loading = false;
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'ADMIN') {
          this.error = 'You must log in as admin.';
          this.loading = false;
          return;
        }

        this.router.navigateByUrl('/tabs');
      },
      error: (err) => {
        this.error = 'Login failed';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
