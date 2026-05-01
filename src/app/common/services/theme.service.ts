import { Injectable, OnDestroy, signal } from "@angular/core";


export const THEME_STORAGE_KEY = 'training-app-theme-preference';
export const THEME_BROADCAST_CHANNEL_NAME = 'theme-sync';
export const THEME_BROADCAST_CHANNEL_TYPE = 'theme-change';
export type TTheme = "light" | "dark";

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {

    public readonly isDarkPalette = signal(false);
    private readonly themeChannel = new BroadcastChannel(THEME_BROADCAST_CHANNEL_NAME);

    constructor() {
        this.initializeThemeFromStorage();
        this.listenForExternalChanges();
    }

    ngOnDestroy(): void {
        this.themeChannel.close();
    }

    get appPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    get getTheme(): TTheme | null {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return storedTheme ? (storedTheme as TTheme) : null;
    }

    public applyDarkPalette(dark: boolean) {
        document.documentElement.classList.toggle('ion-palette-dark', dark);
        this.isDarkPalette.set(dark);
    }

    public setTheme(theme: TTheme, broadcast: boolean = true) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        this.isDarkPalette.set(theme === 'dark');
        this.applyDarkPalette(theme === 'dark');
        if (broadcast) {
            console.log('broadcasting theme change', theme);
            this.themeChannel.postMessage({
                type: THEME_BROADCAST_CHANNEL_TYPE,
                theme
            })
        }
    }

    private listenForExternalChanges(): void {
        this.themeChannel.onmessage = (event: MessageEvent<{ type: string, theme: TTheme }>) => {
            if (event.data?.type === THEME_BROADCAST_CHANNEL_TYPE) {
                this.setTheme(event.data.theme, false);
            }
        }
    }

    public initializeThemeFromStorage() {
        const theme = this.getTheme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (!theme) return this.applyDarkPalette(prefersDark);

        this.isDarkPalette.set(theme === 'dark');
        return this.applyDarkPalette(theme === 'dark');
    }


}