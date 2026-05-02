import { Component } from "@angular/core";
import { AppModule } from "src/app/app.module";
import { AlertController, IonicModule, ViewWillEnter } from "@ionic/angular";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { userGatewayService } from "../../services/user-gateway.service";
import { CommonService } from "src/app/common/services/common.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { IUser } from "src/app/types/api.types";
import { addIcons } from "ionicons";
import { checkmarkCircleSharp, closeCircleSharp, refreshSharp, personAddSharp, createSharp, trashSharp } from "ionicons/icons";
import { ThemeService } from "src/app/common/services/theme.service";
@Component({
    selector: 'app-user-management-view-all',
    templateUrl: './user-management.view-all.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule, NgxDatatableModule]
})

export class UserManagementViewAllPage implements ViewWillEnter {
    public userManagementForm: FormGroup;
    public users: IUser[] = [];
    public searchQueryString: string = '';
    public searchUserType: IUser["user_type"] | 'all' = 'all';
    public isLoading = false;
    public isLoadingUpdateUserType = false;
    public updatingUserId: IUser["_id"] | null = null;
    public showCheckMark = false;
    public showXMark = false;

    constructor(
        private FormBuilder: FormBuilder,
        private UserGatewayService: userGatewayService,
        private CommonService: CommonService,
        private AlertController: AlertController,
        public ThemeService: ThemeService,
    ) {
        this.users = [];
        this.userManagementForm = this.FormBuilder.group({

        })
        addIcons({ refreshSharp, checkmarkCircleSharp, closeCircleSharp, personAddSharp, createSharp, trashSharp });
    }

    public ionViewWillEnter(): void {
        this.loadUsers();
    }

    public ionViewWillLeave(): void {
        this.resetStates();
    }

    public resetStates(): void {
        this.userManagementForm.reset();
        this.searchQueryString = '';
        this.searchUserType = 'all';
        this.users = [];
        this.updatingUserId = null;
        this.showCheckMark = false;
        this.showXMark = false;
        this.isLoading = false;
        this.isLoadingUpdateUserType = false;
    }
    public loadUsers = () => {
        this.isLoading = true;
        this.UserGatewayService.getUsers({
            query_string: this.searchQueryString,
            user_type: this.searchUserType
        }).subscribe(
            (res: any) => {
                this.isLoading = false;
                this.users = res.data;
            },
            (error: any) => {
                this.isLoading = false;
                this.CommonService.createToast({
                    message: error.error.message,
                    duration: 2,
                    color: 'danger'
                })
            },
            () => {
                this.isLoading = false;
            }
        )
    }

    public onUserTypeChange(event: CustomEvent<{ value: IUser["user_type"] }>, row: IUser): void {
        const newUserType = event.detail?.value ?? null;
        if (newUserType === null || newUserType === row.user_type) {
            return;
        }
        this.isLoadingUpdateUserType = true;
        this.updatingUserId = row._id;
        this.UserGatewayService.updateUserType({ _id: row._id, user_type: newUserType }).subscribe({
            next: () => {
                row.user_type = newUserType;
                this.CommonService.createToast({
                    message: 'User type updated',
                    duration: 2,
                    color: 'success'
                });
                this.showCheckMark = true;
                this.showXMark = false;
            },
            error: (error: { error?: { message?: string } }) => {
                this.isLoadingUpdateUserType = false;
                this.CommonService.createToast({
                    message: error?.error?.message ?? 'Could not update user type',
                    duration: 2,
                    color: 'danger'
                });
                this.showXMark = true;
            },
            complete: () => {
                this.isLoadingUpdateUserType = false;

                setTimeout(() => {
                    this.showCheckMark = false;
                    this.updatingUserId = null;
                    this.showXMark = false;
                }, 1500);
            }
        });
    }

    public isRowUpdating(row: IUser): boolean {
        return this.updatingUserId !== null && this.updatingUserId === row._id;
    }

    public clearSearch(): void {
        this.searchQueryString = '';
        this.searchUserType = 'all';
        this.loadUsers();
    }

    public onSearchChange(event: any): void {
        const searchValue = event.detail?.value || '';
        this.searchQueryString = searchValue;

        if (!searchValue) {
            this.clearSearch();
            return;
        }

        this.loadUsers();
    }

    public onSearchUserTypeChange(event: CustomEvent<{ value: IUser["user_type"] }>): void {
        const newUserType = event.detail?.value || null;
        this.searchUserType = newUserType;
        this.loadUsers();
    }

    public async onDeleteUser(userData: IUser): Promise<void> {
        const alert = await this.AlertController.create({
            header: 'Delete user',
            message: `Are you sure you want to delete user: ${userData.first_name} ${userData.last_name} (${userData.email})?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: (): void => {
                        this.executeDeleteUser(userData._id);
                    },
                },
            ],
        });
        await alert.present();
    }

    private executeDeleteUser(userId: IUser["_id"]): void {
        this.UserGatewayService.deleteUser({ _id: userId }).subscribe({
            next: () => {
                this.CommonService.createToast({
                    message: 'User deleted successfully',
                    duration: 2,
                    color: 'success',
                });
                this.CommonService.createToast({
                    message: 'User has been deleted.',
                    duration: 2,
                    color: 'success'
                })
                this.loadUsers();
            },
            error: (error: { error?: { message?: string } }) => {
                this.CommonService.createToast({
                    message: error?.error?.message ?? 'Could not delete user',
                    duration: 2,
                    color: 'danger',
                });
            },
        });
    }
}