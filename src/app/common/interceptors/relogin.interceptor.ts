import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from 'src/app/common/services/session.service';

export const reloginInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const session = inject(SessionService);

    return next(req).pipe(
        catchError((error) => {
            if (error?.error?.relogin === true) {
                session.clearUser();
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        }),
    );
};
