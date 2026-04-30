import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleSharp, logInSharp } from 'ionicons/icons';
import { AppModule } from 'src/app/app.module';

@Component({
    selector: 'app-reset-password-success',
    templateUrl: './reset-password-success.page.html',
    standalone: true,
    imports: [AppModule, IonicModule],
})
export class ResetPasswordSuccessPage {
    constructor() {
        addIcons({ logInSharp, checkmarkCircleSharp });
    }
}
