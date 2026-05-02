import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refreshSharp, closeCircleSharp, addSharp, createSharp, trashSharp, timeSharp, syncSharp, checkmarkCircleSharp } from 'ionicons/icons';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/common/services/common.service';
import { ITodo, TODO_STATUS_COLOR, TODO_STATUS_ICON, TODO_STATUS_VALUES, TodoStatus } from 'src/app/types/api.types';
import { TodoFilterParams, TodoGatewayService } from '../../services/todo-gateway.service';
import { ThemeService } from 'src/app/common/services/theme.service';
import { TodoStatusSelectComponent } from '../../components/todo-status-select/todo-status-select.component';
import { TodoAssignedToSelectComponent } from 'src/app/common/components/todo-assigned-to-select/todo-assigned-to-select.component';

@Component({
    selector: 'app-todos-my-todos',
    templateUrl: './todos.my-todos.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule, NgxDatatableModule, TodoStatusSelectComponent, TodoAssignedToSelectComponent],
})
export class TodosMyTodosPage implements ViewWillEnter {
    public todosForm: FormGroup;
    public todos: ITodo[] = [];
    public isLoading = false;
    public searchQueryString = '';
    public searchStatus: TodoStatus | 'all' = 'all';
    protected readonly statusValues = TODO_STATUS_VALUES;
    protected readonly statusIcon = TODO_STATUS_ICON;
    protected readonly statusColor = TODO_STATUS_COLOR;

    public getStatusIcon(status: TodoStatus): string {
        return TODO_STATUS_ICON[status];
    }

    public getStatusColor(status: TodoStatus): string {
        return TODO_STATUS_COLOR[status];
    }

    constructor(
        private FormBuilder: FormBuilder,
        private Router: Router,
        private AlertController: AlertController,
        private TodoGatewayService: TodoGatewayService,
        private CommonService: CommonService,
        public ThemeService: ThemeService,
    ) {
        this.todosForm = this.FormBuilder.group({});
        addIcons({ refreshSharp, closeCircleSharp, addSharp, createSharp, trashSharp, timeSharp, syncSharp, checkmarkCircleSharp });
    }

    public ionViewWillEnter(): void {
        this.loadTodos();
    }

    public ionViewWillLeave(): void {
        this.resetStates();
    }

    public resetStates(): void {
        this.todos = [];
        this.searchQueryString = '';
        this.searchStatus = 'all';
        this.isLoading = false;
    }

    public loadTodos = (): void => {
        this.isLoading = true;
        const params: TodoFilterParams = {
            query_string: this.searchQueryString ?? undefined,
            status: this.searchStatus,
        };
        this.TodoGatewayService.getMyTodos(params).subscribe({
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
    };

    public onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
        this.searchQueryString = event.detail?.value ?? '';
        this.loadTodos();
    }

    public onStatusChange(event: CustomEvent<{ value: TodoStatus | 'all' }>): void {
        this.searchStatus = event.detail?.value ?? 'all';
        this.loadTodos();
    }

    public updateTodoField(todo: ITodo, field: keyof ITodo, value: unknown): void {
        const updated: ITodo = { ...todo, [field]: value };
        this.TodoGatewayService.updateTodo(updated).subscribe({
            next: () => {
                const idx = this.todos.findIndex(t => t._id === todo._id);
                if (idx !== -1) {
                    this.todos[idx] = { ...this.todos[idx], [field]: value };
                    this.todos = [...this.todos];
                }
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
        this.loadTodos();
    }
}
