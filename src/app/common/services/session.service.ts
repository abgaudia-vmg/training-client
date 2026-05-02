import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { Observable, tap } from 'rxjs';
import { AuthGatewayService } from '../../auth/services/auth-gateway.service.ts.js';
import { CurrentUser } from '../../auth/types/current-user.type.js';
import { thumbsUpOutline } from "ionicons/icons";
import { CommonService } from "./common.service.js";
import { Router } from "@angular/router";

export const SESSION_BROADCAST_CHANNEL_NAME = 'session-sync';
export const SESSION_BROADCAST_CHANNEL_TYPE_LOGOUT = 'session-logout';
export const SESSION_BROADCAST_CHANNEL_TYPE_LOGOUT_SUCCESS = 'session-logout-success';

@Injectable({ providedIn: 'root' })
export class SessionService implements OnDestroy {
    public sessionChannel = new BroadcastChannel(SESSION_BROADCAST_CHANNEL_NAME);
    readonly user = signal<CurrentUser | null>(null);
    readonly isLoggedIn = computed(() => this.user() !== null);
    public normalizedRole = signal<string>('');
    public normalizedFullName = computed(() => {
        const normalizedFname = this.normalizeString(this.user()?.first_name ?? '');
        const normalizedLname = this.normalizeString(this.user()?.last_name ?? '');
        return `${normalizedFname} ${normalizedLname}`;
    });

    ngOnDestroy(): void {
        // this.user.set(null);
        this.sessionChannel.close();
    }

    constructor(
        private readonly AuthGatewayService: AuthGatewayService,
        private readonly AlertController: AlertController,
        private readonly Router: Router,
        private readonly CommonService: CommonService) { }
    public loadCurrentUser = (): Observable<CurrentUser> => {
        // const epochAtSubscribe = this.sessionEpoch;
        return (this.AuthGatewayService.getLoggedInUserDetails() as Observable<any>).pipe(
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

    public listenForExternalChanges(): void {
        this.sessionChannel.onmessage = (event: MessageEvent<{ type: string, user: CurrentUser }>) => {
            console.log(event.data);
            if (event.data?.type === SESSION_BROADCAST_CHANNEL_TYPE_LOGOUT) {
                this.CommonService.createToast({
                    message: 'Logout Message Received. Logging out...',
                    duration: 2,
                    color: 'info',
                });
                this.logout(false);
            }
        }
    }


    private clearAccessibleCookies(): void {
        const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
        const hostname = window.location.hostname;
        const names =
            document.cookie
                ?.split(';')
                .map((part) => part.split('=')[0]?.trim() ?? '')
                .filter((name) => name.length > 0) ?? [];
        for (const name of names) {
            document.cookie = `${name}=;expires=${expire};path=/`;
            document.cookie = `${name}=;expires=${expire};path=/;domain=${hostname}`;
            document.cookie = `${name}=;expires=${expire};path=/;domain=.${hostname}`;
        }
    }

    private finalizeLogout(broadcastLogout: boolean = false): void {
        this.clearAccessibleCookies();
        this.clearUser();
        void this.Router.navigate(['/auth/login']);
        this.CommonService.createToast({
            message: 'Logout successful',
            duration: 2,
            color: 'success',
        });

        if (broadcastLogout) {
            this.sessionChannel.postMessage({
                type: SESSION_BROADCAST_CHANNEL_TYPE_LOGOUT_SUCCESS,
            });
        }
    }

    public logout(showConfirmation: boolean = true): void {
        if (!showConfirmation) {
            this.AuthGatewayService.logout({}).subscribe({
                next: () => this.finalizeLogout(),
                error: () => this.finalizeLogout(),
            });
            return;
        }
        this.AlertController.create({
            header: 'Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Logout', role: 'confirm',
                    handler: () => {
                        this.AuthGatewayService.logout({}).subscribe({
                            next: () => this.finalizeLogout(),
                            error: () => this.finalizeLogout(),
                        });
                    }
                },
            ],
        }).then((alert) => {
            alert.present();
        });
    }


}
