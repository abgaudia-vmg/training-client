import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { SessionService } from 'src/app/common/services/session.service';
import { CommonService } from "../services/common.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private readonly SessionService: SessionService,
        private readonly Router: Router,
        private readonly CommonService: CommonService
    ) { }

    canActivate(): boolean | Observable<boolean> {
        if (this.SessionService.isLoggedIn()) {
            return true;
        }

        if (!this.SessionService.isLoggedIn()) {
            void this.Router.navigate(['/auth/login']);
            this.CommonService.createToast({
                message: 'You are not logged in',
                duration: 2,
                color: 'danger',
            });
            return false;
        }

        return this.SessionService.loadCurrentUser().pipe(
            map((): boolean => {
                if (this.SessionService.isLoggedIn()) {
                    return true;
                }
                void this.Router.navigate(['/auth/login']);
                return false;
            }),
            catchError(() => {
                void this.Router.navigate(['/auth/login']);
                return of(false);
            }),
        );
    }
}
