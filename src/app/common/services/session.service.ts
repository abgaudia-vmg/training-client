import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthGatewayService } from '../../auth/services/auth-gateway.service.ts.js';
import { CurrentUser } from '../../auth/types/current-user.type.js';

@Injectable({ providedIn: 'root' })
export class SessionService {
    readonly user = signal<CurrentUser | null>(null);
    readonly isLoggedIn = computed(() => this.user() !== null);

    constructor(private authGatewayService: AuthGatewayService) { }

    public loadCurrentUser = (): Observable<CurrentUser> => {
        return (this.authGatewayService.getLoggedInUserDetails() as Observable<any>).pipe(
            tap((user) => {
                //@ts-ignore
                this.user.set(user?.data)
            })
        );
    };

    public clearUser = (): void => {
        this.user.set(null);
    };
}
