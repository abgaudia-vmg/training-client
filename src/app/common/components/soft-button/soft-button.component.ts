import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { IonicModule } from "@ionic/angular";

/** Mirrors `ion-button` color names; visuals use softer tints than Ionic defaults. */
export type SoftButtonColor =
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "danger"
    | "medium"
    | "light"
    | "dark";

@Component({
    selector: "app-soft-button",
    templateUrl: "./soft-button.component.html",
    styleUrls: ["./soft-button.component.scss"],
    imports: [CommonModule, IonicModule],
    standalone: true,
})
export class AppSoftButtonComponent {
    @Input() text: string = "";
    @Input() color: SoftButtonColor = "primary";
    @Input() onClick: (args: unknown) => void = () => { };
    constructor() {
        this.onClick = this.onClick.bind(this);
    }
}