import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthGatewayService } from '../../auth/services/auth-gateway.service.ts.js';
import { CurrentUser } from '../../auth/types/current-user.type.js';

@Injectable({ providedIn: 'root' })
export class SessionService {
    readonly user = signal<CurrentUser | null>(null);
    readonly isLoggedIn = computed(() => this.user() !== null);

    /** Bumped on `clearUser` so in-flight `/auth/me` responses cannot repopulate the session after logout. */
    private sessionEpoch = 0;

    constructor(private authGatewayService: AuthGatewayService) { }

    public loadCurrentUser = (): Observable<CurrentUser> => {
        const epochAtSubscribe = this.sessionEpoch;
        return (this.authGatewayService.getLoggedInUserDetails() as Observable<any>).pipe(
            tap((user) => {
                if (epochAtSubscribe !== this.sessionEpoch) {
                    return;
                }
                //@ts-ignore
                this.user.set(user?.data ?? null);
            })
        );
    };

    public clearUser = (): void => {
        this.sessionEpoch += 1;
        this.user.set(null);
    };
}
