import { Component, effect, ElementRef, ViewChild } from "@angular/core";
import { ThemeService, TTheme } from "../services/theme.service";
import { CommonModule } from "@angular/common";
import { IonicModule, IonToggle, ToggleCustomEvent } from "@ionic/angular";
import { moon, sunny } from "ionicons/icons";
import { addIcons } from "ionicons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-dark-mode-toggle',
    templateUrl: './dark-mode.toggle.component.html',
    standalone: true,
    imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class DarkModeToggleComponent {
    @ViewChild('darkModeToggle') public readonly toggleRef?: ElementRef<IonToggle>;
    public testToggleState = false


    public readonly darkModeControl = new FormControl(false);
    constructor(public readonly ThemeService: ThemeService) {
        addIcons({ moon, sunny });

        effect(() => {
            const isDark = this.ThemeService.isDarkPalette();
            this.darkModeControl.setValue(isDark);
        });
    }

    public onDarkModeToggle(event: ToggleCustomEvent): void {
        const checked = event.detail?.checked ?? false;
        const theme: TTheme = checked ? 'dark' : 'light';
        this.ThemeService.setTheme(theme);
    }

    public testToggle(): void {
        this.darkModeControl.setValue(!this.darkModeControl.value);
    }
}