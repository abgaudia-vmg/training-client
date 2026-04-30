import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { refreshSharp } from 'ionicons/icons';
import { AppModule } from "src/app/app.module";
import { AuthGatewayService } from "../../services/auth-gateway.service.ts";
import {
    PASSWORD_STRENGTH_MESSAGE,
    PASSWORD_STRENGTH_MESSAGE_LIST,
    PASSWORD_STRENGTH_REGEX,
    passwordsMatchValidator,
} from '../../../common/validators/password-validators.js';
import { CommonService } from "src/app/common/services/common.service";


@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule]
})

export class ResetPasswordPage {
    public resetPasswordForm: FormGroup;
    protected isLoading = false;
    protected readonly passwordRequirementsMessage = PASSWORD_STRENGTH_MESSAGE.split('\n');
    protected readonly passwordRequirementsMessageList = PASSWORD_STRENGTH_MESSAGE_LIST;
    protected readonly errMsgUsername = 'Username is required.'
    protected readonly errMsgConfirmPassword = 'Passwords do not match.'

    constructor(
        private FormBuilder: FormBuilder,
        private Router: Router,
        private AuthGatewayService: AuthGatewayService,
        private CommonService: CommonService
    ) {
        this.resetPasswordForm = this.FormBuilder.group(
            {
                username: ['', [Validators.required]],
                password: ['', [Validators.required, Validators.pattern(PASSWORD_STRENGTH_REGEX)]],
                confirmPassword: ['', [Validators.required]],
            },
            { validators: [passwordsMatchValidator()] },
        );
        addIcons({ refreshSharp });
    }

    public resetPassword = (): void => {
        this.isLoading = true;
        this.AuthGatewayService.resetPassword(this.resetPasswordForm.value)
            .pipe(finalize(() => { // Learning Purposes: runs after next or error | When request is completed
                this.isLoading = false;
            }))
            .subscribe({
                next: (res: any) => {
                    if (!res.success) {
                        this.CommonService.createToast({ message: res.message, duration: 2, color: 'danger' });
                        return;
                    }
                    this.CommonService.createToast({ message: 'Password reset successful', duration: 2, color: 'success' });
                    this.Router.navigate(['/auth/reset-password/success']);
                },
                error: (response: any) => {
                    const message =
                        typeof response === 'object' && response !== null && 'message' in response
                            ? String((response as { message?: unknown }).message ?? 'Reset failed')
                            : 'Reset failed';
                    this.CommonService.createToast({ message: response?.error?.message, duration: 2, color: 'danger' });
                },
            });
    };

}
