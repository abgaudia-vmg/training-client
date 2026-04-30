import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { saveSharp, refreshSharp, arrowBackSharp } from 'ionicons/icons';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/common/services/common.service';
import { userGatewayService } from '../../services/user-gateway.service';
import { IUser } from 'src/app/types/api.types';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
    optionalPasswordStrengthValidator,
    PASSWORD_STRENGTH_MESSAGE_LIST,
    PASSWORD_STRENGTH_REGEX,
} from 'src/app/common/validators/password-validators';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule],
})
export class UserFormPage implements ViewWillEnter {
    public userForm: FormGroup;
    public isLoading = false;
    public isEditMode = false;
    public generatedEmail = '';
    protected readonly passwordRequirementsMessageList = PASSWORD_STRENGTH_MESSAGE_LIST;
    private userId: IUser['_id'] | null = null;

    constructor(
        private FormBuilder: FormBuilder,
        private Router: Router,
        private ActivatedRoute: ActivatedRoute,
        private UserGatewayService: userGatewayService,
        private CommonService: CommonService,
        private AuthService: AuthService,
    ) {
        this.userForm = this.FormBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern(PASSWORD_STRENGTH_REGEX)]],
            user_type: ['staff', [Validators.required]],
        });
        this.userForm.get('first_name')?.valueChanges.subscribe(() => this.updateGeneratedEmail());
        this.userForm.get('last_name')?.valueChanges.subscribe(() => this.updateGeneratedEmail());

        addIcons({ saveSharp, refreshSharp, arrowBackSharp });
    }

    private updateGeneratedEmail(): void {
        const firstName: string = this.userForm.get('first_name')?.value ?? '';
        const lastName: string = this.userForm.get('last_name')?.value ?? '';
        if (firstName || lastName) {
            this.generatedEmail = this.AuthService.generateEmail({ firstName, lastName });
        } else {
            this.generatedEmail = '';
        }
    }

    public ionViewWillEnter(): void {
        this.userId = this.ActivatedRoute.snapshot.paramMap.get('id');
        this.isEditMode = !!this.userId;

        const passwordCtrl = this.userForm.get('password');
        if (this.isEditMode) {
            passwordCtrl?.setValue('');
            passwordCtrl?.setValidators([optionalPasswordStrengthValidator(PASSWORD_STRENGTH_REGEX)]);
            passwordCtrl?.updateValueAndValidity({ emitEvent: false });
            this.loadUser();
        } else {
            passwordCtrl?.setValue('');
            passwordCtrl?.setValidators([Validators.required, Validators.pattern(PASSWORD_STRENGTH_REGEX)]);
            passwordCtrl?.updateValueAndValidity({ emitEvent: false });
        }
    }

    private loadUser(): void {
        if (!this.userId) return;
        this.isLoading = true;
        this.UserGatewayService.getOne({ _id: this.userId }).subscribe(
            (res: any) => {
                const user: IUser = res?.data;
                this.userForm.patchValue({
                    first_name: user?.first_name ?? '',
                    last_name: user?.last_name ?? '',
                    username: user?.username ?? '',
                    user_type: user?.user_type ?? 'staff',
                });
                this.generatedEmail = user?.email ?? '';
            },
            (error: { error?: { message?: string } }) => {
                this.CommonService.createToast({
                    message: error?.error?.message ?? 'Failed to load user',
                    duration: 2,
                    color: 'danger',
                });
                this.isLoading = false;
            },
            () => {
                this.isLoading = false;
            },
        );
    }

    public submitForm = (): void => {
        if (this.userForm.invalid) return;
        this.isLoading = true;

        if (this.isEditMode && this.userId) {
            const userData: Partial<IUser> = { ...this.userForm.value, email: this.generatedEmail };
            if (!userData.password) delete userData.password;

            this.UserGatewayService.updateUser({ user_id: this.userId, userData }).subscribe(
                () => {
                    this.CommonService.createToast({
                        message: 'User updated successfully',
                        duration: 2,
                        color: 'success',
                    });
                    this.Router.navigate(['/user-management/view-all']);
                },
                (error: { error?: { message?: string } }) => {
                    this.CommonService.createToast({
                        message: error?.error?.message ?? 'Failed to update user',
                        duration: 2,
                        color: 'danger',
                    });
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                },
            );
        } else {
            this.UserGatewayService.createUser({ ...this.userForm.value, email: this.generatedEmail }).subscribe(
                () => {
                    this.CommonService.createToast({
                        message: 'User created successfully',
                        duration: 2,
                        color: 'success',
                    });
                    this.Router.navigate(['/user-management/view-all']);
                },
                (error: { error?: { message?: string } }) => {
                    this.CommonService.createToast({
                        message: error?.error?.message ?? 'Failed to create user',
                        duration: 2,
                        color: 'danger',
                    });
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                },
            );
        }
    };

    public goBack = (): void => {
        this.Router.navigate(['/user-management/view-all']);
    };
}
