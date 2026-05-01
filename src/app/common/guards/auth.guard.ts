import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { SessionService } from 'src/app/common/services/session.service';
import { CommonService } from '../services/common.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private readonly SessionService: SessionService,
        private readonly Router: Router,
        private readonly CommonService: CommonService,
    ) { }

    canActivate(): boolean | Observable<boolean | UrlTree> | UrlTree {
        if (this.SessionService.isLoggedIn()) {
            return true;
        }

        return this.SessionService.loadCurrentUser().pipe(
            map((): boolean | UrlTree =>
                this.SessionService.isLoggedIn()
                    ? true
                    : this.Router.createUrlTree(['/auth/login']),
            ),
            tap((ok) => {
                if (ok !== true) {
                    void this.CommonService.createToast({
                        message: 'You are not logged in',
                        duration: 2,
                        color: 'danger',
                    });
                }
            }),
            catchError(() => {
                void this.CommonService.createToast({
                    message: 'You are not logged in',
                    duration: 2,
                    color: 'danger',
                });
                return of(this.Router.createUrlTree(['/auth/login']));
            }),
        );
    }
}
