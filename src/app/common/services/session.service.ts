import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthGatewayService } from '../../auth/services/auth-gateway.service.ts.js';
import { CurrentUser } from '../../auth/types/current-user.type.js';
import { thumbsUpOutline } from "ionicons/icons";

@Injectable({ providedIn: 'root' })
export class SessionService {
    readonly user = signal<CurrentUser | null>(null);
    readonly isLoggedIn = computed(() => this.user() !== null);
    public normalizedRole = signal<string>('');
    public normalizedFullName = computed(() => {
        const normalizedFname = this.normalizeString(this.user()?.first_name ?? '');
        const normalizedLname = this.normalizeString(this.user()?.last_name ?? '');
        return `${normalizedFname} ${normalizedLname}`;
    });

    constructor(private authGatewayService: AuthGatewayService) { }
    public loadCurrentUser = (): Observable<CurrentUser> => {
        // const epochAtSubscribe = this.sessionEpoch;
        return (this.authGatewayService.getLoggedInUserDetails() as Observable<any>).pipe(
            tap((user: any) => {
                //@ts-ignore
                this.user.set(user?.data ?? null);
                this.normalizedRole.set(this.normalizeString(user?.data?.role ?? ''));
                this.normalizedRole.set(this.normalizeString(user?.data?.role ?? ''));
            })
        );
    };

    private normalizeString = (str: string) => {
        return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
    };

    public clearUser = (): void => {
        // this.sessionEpoch += 1;
        this.user.set(null);
    };
}
