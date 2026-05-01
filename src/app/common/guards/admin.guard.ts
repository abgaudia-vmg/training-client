import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { CommonService } from "../services/common.service";

/** Expects `AuthGuard` on a parent route so `user()` is already loaded. */
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private readonly SessionService: SessionService,
        private readonly Router: Router,
        private readonly CommonService: CommonService,
    ) { }

    canActivate(): boolean | UrlTree {

        if (!this.SessionService.isLoggedIn()) {
            this.CommonService.createToast({
                message: 'You are not logged in',
                duration: 2,
                color: 'danger',
            })
            return this.Router.createUrlTree(['/auth/login']);
        }
        if (this.SessionService.user()?.role === 'staff') {
            this.CommonService.createToast({
                message: 'You are not authorized to access this page. Redirecting to your tasks...',
                duration: 2,
                color: 'danger',
            })
            return this.Router.createUrlTree(['/tasks/my-tasks']);
        }
        if (this.SessionService.user()?.role === 'admin') {
            return true;
        }
        return this.Router.createUrlTree(['/auth/login']);
    }
}
