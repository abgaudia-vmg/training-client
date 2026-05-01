import { CommonModule } from "@angular/common";
import { Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonicModule, AlertController } from '@ionic/angular';
import { AppModule } from "./app.module";
import { SessionService } from "./common/services/session.service";
import { AuthGatewayService } from "./auth/services/auth-gateway.service.ts";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonService } from "./common/services/common.service";
import { filter, map, startWith } from 'rxjs';
import { ThemeService, TTheme } from "./common/services/theme.service";
import { DarkModeToggleComponent } from "./common/components/dark-mode.toggle.component";
import { addIcons } from "ionicons";
import { listOutline, logOutOutline, peopleOutline } from "ionicons/icons";
import { AppSoftButtonComponent } from "./common/components/soft-button/soft-button.component";

@Component({
    selector: 'app-root',
    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html',
    imports: [CommonModule, AppSoftButtonComponent, IonicModule, AppModule, RouterLink, RouterLinkActive, DarkModeToggleComponent],
    standalone: true,
})
export class AppComponent {
    public showSideMenu = false;
    private currentUrl!: Signal<string>;
    public firstLetterFirstName = computed(() => this.sessionService.user()?.first_name?.[0]?.toUpperCase?.() ?? '');
    public normalizedRole = computed(() => {
        const role = this.sessionService.user()?.role ?? '';
        return role ? role[0].toUpperCase() + role.slice(1).toLowerCase() : '';
    });

    /** Side menu: logged in and not on an auth route (back navigation can land on `/auth/login` with session still set). */
    public readonly showAppMenu = computed((): boolean => {
        if (this.sessionService.user() == null) {
            return false;
        }
        const path = this.currentUrl() ?? '';
        return !path.includes('/auth');
    });

    constructor(
        private readonly AlertController: AlertController,
        public sessionService: SessionService,
        private readonly Router: Router,
        private readonly CommonService: CommonService,
        private readonly AuthGatewayService: AuthGatewayService,
        private readonly ThemeService: ThemeService,
    ) {
        this.currentUrl = toSignal(
            this.Router.events.pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                map(() => this.Router.url),
                startWith(this.Router.url),
            ),
            { initialValue: this.Router.url },
        );
        addIcons({ listOutline, peopleOutline, logOutOutline });
    }

    public onDarkModeToggle(event: CustomEvent<{ checked: boolean }>): void {
        const checked = event.detail?.checked ?? false;
        const theme: TTheme = checked ? 'dark' : 'light';
        this.ThemeService.setTheme(theme);
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

    private finalizeLogout(): void {
        this.clearAccessibleCookies();
        this.sessionService.clearUser();
        void this.Router.navigate(['/auth/login']);
        this.CommonService.createToast({
            message: 'Logout successful',
            duration: 2,
            color: 'success',
        });
    }

    public logout(): void {


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
