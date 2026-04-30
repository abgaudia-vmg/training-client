import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { SessionService } from 'src/app/common/services/session.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
    constructor(
        private readonly SessionService: SessionService,
        private readonly Router: Router,
    ) { }

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean>
        | boolean
        | UrlTree {
        if (this.SessionService.isLoggedIn()) {
            return this.SessionService.user()?.role === 'admin'
                ? true
                : this.Router.createUrlTree(['/todos/my-todos']);
        }


        return this.SessionService.loadCurrentUser().pipe(
            map((user: any) =>
                user?.role === 'admin'
                    ? true
                    : this.Router.createUrlTree(['/todos/my-todos']),
            )
        );
    }
}
