import { Component } from "@angular/core";
import { ThemeService, TTheme } from "../services/theme.service";
import { CommonModule } from "@angular/common";
import { IonicModule, ToggleCustomEvent } from "@ionic/angular";
import { moon, sunny } from "ionicons/icons";
import { addIcons } from "ionicons";

@Component({
    selector: 'app-dark-mode-toggle',
    templateUrl: './dark-mode.toggle.component.html',
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class DarkModeToggleComponent {
    constructor(public readonly ThemeService: ThemeService) {
        addIcons({ moon, sunny });

    }

    public onDarkModeToggle(event: ToggleCustomEvent): void {
        const checked = event.detail?.checked ?? false;
        const theme: TTheme = checked ? 'dark' : 'light';
        this.ThemeService.setTheme(theme);
    }
}