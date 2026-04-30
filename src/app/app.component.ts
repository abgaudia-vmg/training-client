import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppModule } from "./app.module";
import { SessionService } from "./common/services/session.service";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonService } from "./common/services/common.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [CommonModule, IonicModule, AppModule, RouterLink, RouterLinkActive],
  standalone: true,
})
export class AppComponent {
  constructor(
    public sessionService: SessionService,
    private router: Router,
    private CommonService: CommonService
  ) {
    this.sessionService.loadCurrentUser().subscribe({
      error: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  public logout(): void {
    this.sessionService.clearUser();
    this.router.navigate(['/auth/login']);
    this.CommonService.createToast({
      message: 'Logout successful',
      duration: 2,
      color: 'success',
    });
  }
}
