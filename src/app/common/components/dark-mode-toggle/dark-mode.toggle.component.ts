import { Component, effect } from "@angular/core";
import { ThemeService, TTheme } from "../../services/theme.service";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
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
    public readonly darkModeControl = new FormControl(false);
    constructor(public readonly ThemeService: ThemeService) {
        addIcons({ moon, sunny });

        effect(() => {
            const isDark = this.ThemeService.isDarkPalette();
            this.darkModeControl.setValue(isDark, { emitEvent: false });
        });

        this.darkModeControl.valueChanges.subscribe((checked) => {
            const theme: TTheme = (checked ?? false) ? 'dark' : 'light';
            this.ThemeService.setTheme(theme);
        });
    }

    public testToggle(): void {
        this.darkModeControl.setValue(!this.darkModeControl.value);
    }
}