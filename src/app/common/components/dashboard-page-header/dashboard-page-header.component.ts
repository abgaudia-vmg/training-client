import { Component, Injectable, Input } from "@angular/core";
import { AppModule } from "src/app/app.module";
import { IonicModule } from "@ionic/angular";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector: 'app-dashboard-page-header',
    templateUrl: './dashboard-page-header.component.html',
    standalone: true,
    imports: [AppModule, IonicModule],
})
export class DashboardPageHeaderComponent {
    @Input() title: string = '';
    constructor(public readonly ThemeService: ThemeService) { }
}