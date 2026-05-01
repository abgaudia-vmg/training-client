import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { IonicModule, IonIcon } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { logInSharp, personAddSharp, refreshSharp } from 'ionicons/icons';
import { AppModule } from "src/app/app.module";
import { AuthGatewayService } from "../../services/auth-gateway.service.ts";
import { finalize } from "rxjs";
import { CommonService } from "src/app/common/services/common.service";
import { environment } from "src/environments/environment.js";
import { SessionService } from "../../../common/services/session.service.js";
import { AppSoftButtonComponent } from "src/app/common/components/soft-button/soft-button.component";


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule, AppSoftButtonComponent]
})

export class LoginPage {
    public loginForm: FormGroup; // learning purposes: form instance > form state + validation
    protected isLoading = false;
    public showDevButtons = environment.show_dev_buttons;

    constructor(
        private FormBuilder: FormBuilder,
        private Router: Router,
        private AuthGatewayService: AuthGatewayService,
        private CommonService: CommonService,
        private SessionService: SessionService
    ) {
        // Learning Purposes: Initialize the login form with default values and validation rules.
        // - username: required field
        // - password: required field
        this.loginForm = this.FormBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        addIcons({ logInSharp, personAddSharp, refreshSharp });
    }

    // ngOnInit() { // remove implements OnInit
    //     // console.log("Login Page")
    //     //this.varForEmail = this.activatedRoute.snapsot.paramMap.get('email')
    //     // if(this.varForEmail) { this.loginForm.patchValue({ email: this.varForEmail }) }    
    // }

    //ionViewWIllEnter > fetch every route to page — e2 dapat

    public loginUser = () => {
        this.isLoading = true; //learning purposes: start loading spinner
        this.AuthGatewayService.login(this.loginForm.value)
            //subscribe nlngs
            .pipe(finalize(() => { // learning purposes: runs after next or error | When request is completed
                this.isLoading = false;
            }))
            .subscribe({
                next: (res: any) => {
                    if (!res?.success) {
                        this.CommonService.createToast({
                            message: String(res?.message ?? 'Login failed'),
                            duration: 2,
                            color: 'danger',
                        })
                        return
                    }
                    this.SessionService.loadCurrentUser().subscribe({
                        next: (res: any) => {

                            this.CommonService.createToast({
                                message: 'Login successful',
                                duration: 2,
                                color: 'success',
                            });
                            if (res?.data?.role === 'admin') {
                                this.Router.navigate(['/user-management/view-all']);
                            } else {
                                this.Router.navigate(['/todos/my-todos']);
                            }
                        },
                        error: () => {
                            this.CommonService.createToast({
                                message: 'Login successful but failed to load user profile',
                                duration: 2,
                                color: 'warning',
                            });
                            this.Router.navigate(['/user-management/view-all']);
                        }
                    });
                },
                error: (error: any) => {
                    const message =
                        typeof error === 'object' && error !== null && 'message' in error
                            ? String((error as { message?: unknown }).message ?? 'Login failed')
                            : 'Login failed'
                    this.CommonService.createToast({ message: error?.error?.message, duration: 2, color: 'danger' })
                },
                complete: () => {
                    this.isLoading = false;
                }
            })


    }
    public validateSession = () => {
        this.AuthGatewayService.validateSession().subscribe(
            (res: any) => {
                this.CommonService.createToast({
                    message: res.message || 'Session Validated',
                    duration: 2,
                    color: 'success',
                })
            },
            (error: any) => {
                return this.CommonService.createToast({
                    message: error?.error?.message || "Something went wrong",
                    duration: 2,
                    color: 'danger'
                })
            }
        )
    }

    public prefillStaffLogin = () => {
        this.loginForm.patchValue({
            username: 'stauser@email.com',
            password: 'Pogiako123'
        })
    }

    public prefillAdminLogin = () => {
        this.loginForm.patchValue({
            username: 'myadmin@email.com',
            password: 'your-secure-password'
        })
    }


}
