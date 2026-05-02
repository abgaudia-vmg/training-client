import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refreshSharp, closeCircleSharp, addSharp, createSharp, trashSharp, timeSharp, syncSharp, checkmarkCircleSharp } from 'ionicons/icons';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/common/services/common.service';
import { ThemeService } from 'src/app/common/services/theme.service';
import { ITodo, IUser, TODO_STATUS_COLOR, TODO_STATUS_ICON, TODO_STATUS_VALUES, TodoStatus } from 'src/app/types/api.types';
import { TodoFilterParams, TodoGatewayService } from '../../services/todo-gateway.service';
import { TodoStatusSelectComponent } from '../../components/todo-status-select/todo-status-select.component';
import { TodoAssignedToSelectComponent } from 'src/app/common/components/todo-assigned-to-select/todo-assigned-to-select.component';
import { userGatewayService } from 'src/app/user-management/services/user-gateway.service';
import { DashboardPageHeaderComponent } from "src/app/common/components/dashboard-page-header/dashboard-page-header.component";

@Component({
    selector: 'app-todos-all-users',
    templateUrl: './todos.all-users.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule, NgxDatatableModule, TodoStatusSelectComponent, TodoAssignedToSelectComponent, DashboardPageHeaderComponent],
})
export class TodosAllUsersPage implements ViewWillEnter {
    public todosForm: FormGroup;
    public todos: ITodo[] = [];
    public todosPerUser: ITodo[] = [];
    public isLoading = false;
    public isLoadingUsers = false;
    public searchQueryString = '';
    public searchStatus: TodoStatus | 'all' = 'all';
    public searchAssignedTo: IUser['_id'] | null = null;
    public users: IUser[] = [];
    protected readonly statusValues = TODO_STATUS_VALUES;
    protected readonly statusIcon = TODO_STATUS_ICON;
    protected readonly statusColor = TODO_STATUS_COLOR;

    public getStatusIcon(status: TodoStatus): string {
        return TODO_STATUS_ICON[status];
    }

    public getStatusColor(status: TodoStatus): string {
        return TODO_STATUS_COLOR[status];
    }

    public get displayedTodos(): ITodo[] {
        return this.searchAssignedTo != null ? this.todosPerUser : this.todos;
    }

    constructor(
        private FormBuilder: FormBuilder,
        private Router: Router,
        private AlertController: AlertController,
        private TodoGatewayService: TodoGatewayService,
        private UserGatewayService: userGatewayService,
        private CommonService: CommonService,
        public ThemeService: ThemeService,
    ) {
        this.todosForm = this.FormBuilder.group({});
        addIcons({ refreshSharp, closeCircleSharp, addSharp, createSharp, trashSharp, timeSharp, syncSharp, checkmarkCircleSharp });
    }

    public ionViewWillEnter(): void {
        this.loadUsers();
        this.loadTodos();
    }

    public ionViewWillLeave(): void {
        this.resetStates();
    }

    public resetStates(): void {
        this.todos = [];
        this.todosPerUser = [];
        this.searchQueryString = '';
        this.searchStatus = 'all';
        this.searchAssignedTo = null;
        this.isLoading = false;
        this.users = [];
    }

    public loadUsers(): void {
        this.isLoadingUsers = true;
        this.UserGatewayService.getUsers().subscribe({
            next: (res: any) => {
                this.users = (res?.data ?? []) as IUser[];
            },
            error: () => {
                this.users = [];
            },
            complete: () => {
                this.isLoadingUsers = false;
            },
        });
    }

    public loadTodos = (): void => {
        this.isLoading = true;
        const params: TodoFilterParams = {
            query_string: this.searchQueryString ?? undefined,
            status: this.searchStatus,
        };

        if (this.searchAssignedTo != null) {
            this.TodoGatewayService.getAllTodosPerUser(this.searchAssignedTo, params).subscribe({
                next: (res) => {
                    this.todosPerUser = res?.data ?? [];
                },
                error: (error: { error?: { message?: string } }) => {
                    this.CommonService.createToast({
                        message: error?.error?.message ?? 'Failed to load todos',
                        duration: 2,
                        color: 'danger',
                    });
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
        } else {
            this.TodoGatewayService.getAllTodos(params).subscribe({
                next: (res) => {
                    this.todos = res?.data ?? [];
                },
                error: (error: { error?: { message?: string } }) => {
                    this.CommonService.createToast({
                        message: error?.error?.message ?? 'Failed to load todos',
                        duration: 2,
                        color: 'danger',
                    });
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
        }
    };

    public onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
        this.searchQueryString = event.detail?.value ?? '';
        this.loadTodos();
    }

    public onStatusChange(event: CustomEvent<{ value: TodoStatus | 'all' }>): void {
        this.searchStatus = event.detail?.value ?? 'all';
        this.loadTodos();
    }

    public onAssignedToChange(event: CustomEvent<{ value: IUser['_id'] | null }>): void {
        this.searchAssignedTo = event.detail?.value ?? null;
        if (this.searchAssignedTo == null) {
            this.todosPerUser = [];
        }
        this.loadTodos();
    }

    public updateTodoField(todoToUpdate: ITodo, fieldToUpdate: keyof ITodo, newValue: unknown): void {
        const updatedTodo: ITodo = { ...todoToUpdate, [fieldToUpdate]: newValue };
        this.TodoGatewayService.updateTodo(updatedTodo).subscribe({
            next: () => {
                if (this.searchAssignedTo != null) {
                    const userTodoIndex = this.todosPerUser.findIndex(userTodo => userTodo._id === todoToUpdate._id);
                    if (userTodoIndex !== -1) {
                        this.todosPerUser[userTodoIndex] = { ...this.todosPerUser[userTodoIndex], [fieldToUpdate]: newValue };
                        this.todosPerUser = [...this.todosPerUser];
                    }
                } else {
                    const allTodoIndex = this.todos.findIndex(listTodo => listTodo._id === todoToUpdate._id);
                    if (allTodoIndex !== -1) {
                        this.todos[allTodoIndex] = { ...this.todos[allTodoIndex], [fieldToUpdate]: newValue };
                        this.todos = [...this.todos];
                    }
                }
                this.loadTodos();
                this.CommonService.createToast({
                    message: 'Todo updated successfully',
                    duration: 2,
                    color: 'success',
                });
            },
            error: (error: { error?: { message?: string } }) => {
                this.CommonService.createToast({
                    message: error?.error?.message ?? 'Failed to update todo',
                    duration: 2,
                    color: 'danger',
                });
            },
        });
    }

    public goToAdd = (): void => {
        this.Router.navigate(['/todos/add']);
    };

    public goToEdit = (todo: ITodo): void => {
        this.Router.navigate(['/todos/edit', todo._id]);
    };

    public async onDeleteTodo(todo: ITodo): Promise<void> {
        const alert = await this.AlertController.create({
            header: 'Delete Todo',
            message: `Are you sure you want to delete "${todo.title}"?`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: (): void => {
                        this.executeDeleteTodo(todo._id);
                    },
                },
            ],
        });
        await alert.present();
    }

    private executeDeleteTodo(todoId: ITodo['_id']): void {
        this.TodoGatewayService.deleteTodo(todoId).subscribe({
            next: () => {
                this.CommonService.createToast({
                    message: 'Todo deleted successfully',
                    duration: 2,
                    color: 'success',
                });
                this.loadTodos();
            },
            error: (error: { error?: { message?: string } }) => {
                this.CommonService.createToast({
                    message: error?.error?.message ?? 'Failed to delete todo',
                    duration: 2,
                    color: 'danger',
                });
            },
        });
    }

    public clearSearch(): void {
        this.searchQueryString = '';
        this.searchStatus = 'all';
        this.searchAssignedTo = null;
        this.todosPerUser = [];
        this.loadTodos();
    }
}
