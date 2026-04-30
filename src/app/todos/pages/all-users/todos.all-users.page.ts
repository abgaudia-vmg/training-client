import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refreshSharp, closeCircleSharp } from 'ionicons/icons';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/common/services/common.service';
import { ITodo, TODO_STATUS_VALUES, TodoStatus } from 'src/app/types/api.types';
import { TodoFilterParams, TodoGatewayService } from '../../services/todo-gateway.service';

@Component({
    selector: 'app-todos-all-users',
    templateUrl: './todos.all-users.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule, NgxDatatableModule],
})
export class TodosAllUsersPage implements ViewWillEnter {
    public todosForm: FormGroup;
    public todos: ITodo[] = [];
    public isLoading = false;
    public searchQueryString = '';
    public searchStatus: TodoStatus | 'all' = 'all';
    protected readonly statusValues = TODO_STATUS_VALUES;

    constructor(
        private FormBuilder: FormBuilder,
        private TodoGatewayService: TodoGatewayService,
        private CommonService: CommonService,
    ) {
        this.todosForm = this.FormBuilder.group({});
        addIcons({ refreshSharp, closeCircleSharp });
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
    };

    public onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
        this.searchQueryString = event.detail?.value ?? '';
        this.loadTodos();
    }

    public onStatusChange(event: CustomEvent<{ value: TodoStatus | 'all' }>): void {
        this.searchStatus = event.detail?.value ?? 'all';
        this.loadTodos();
    }

    public clearSearch(): void {
        this.searchQueryString = '';
        this.searchStatus = 'all';
        this.loadTodos();
    }
}
