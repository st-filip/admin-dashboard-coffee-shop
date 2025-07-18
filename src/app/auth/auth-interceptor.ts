import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import { catchError, from, switchMap, throwError } from 'rxjs';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (e) {
    return true;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const excludedUrls = ['/login', '/refresh'];
  if (excludedUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && !isTokenExpired(accessToken)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(req);
  }

  if (refreshToken && !isTokenExpired(refreshToken)) {
    return from(authService.refresh(refreshToken)).pipe(
      switchMap((newTokens) => {
        if (
          newTokens == null ||
          !newTokens.accessToken ||
          !newTokens.refreshToken
        ) {
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => new Error('Unable to refresh token'));
        }

        localStorage.setItem('accessToken', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);

        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newTokens.accessToken}`,
          },
        });

        return next(clonedReq);
      }),
      catchError((err) => {
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  authService.logout();
  router.navigate(['/login']);
  return throwError(() => new Error('Authentication expired'));
};
