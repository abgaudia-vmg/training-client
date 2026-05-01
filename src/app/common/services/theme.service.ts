import { Injectable, signal } from "@angular/core";


export const THEME_STORAGE_KEY = 'training-app-theme-preference';

export type TTheme = "light" | "dark";

@Injectable({ providedIn: 'root' })
export class ThemeService {

    public readonly isDarkPalette = signal(false);

    constructor() {
        this.initializeThemeFromStorage();
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

    public setTheme(theme: TTheme) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        this.isDarkPalette.set(theme === 'dark');
        this.applyDarkPalette(theme === 'dark');
    }

    public initializeThemeFromStorage() {
        const theme = this.getTheme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!theme) return this.applyDarkPalette(prefersDark);
        this.isDarkPalette.set(theme === 'dark');
        return this.applyDarkPalette(theme === 'dark');
    }
}