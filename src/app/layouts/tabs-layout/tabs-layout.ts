import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-tabs-layout',
  imports: [RouterModule],
  templateUrl: './tabs-layout.html',
  styleUrl: './tabs-layout.scss',
})
export class TabsLayout {
  private router = inject(Router);
  private authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }
}
