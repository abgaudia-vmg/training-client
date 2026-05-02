import { Component, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { saveSharp, refreshSharp, arrowBackSharp } from 'ionicons/icons';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/common/services/common.service';
import { SessionService } from 'src/app/common/services/session.service';
import { ITodo, TODO_STATUS_VALUES, TodoStatus } from 'src/app/types/api.types';
import { TodoGatewayService } from '../../services/todo-gateway.service';
import { TodoStatusSelectComponent } from '../../components/todo-status-select/todo-status-select.component';
import { TodoAssignedToSelectComponent } from 'src/app/common/components/todo-assigned-to-select/todo-assigned-to-select.component';

@Component({
    selector: 'app-todo-form',
    templateUrl: './todo-form.page.html',
    standalone: true,
    imports: [AppModule, IonicModule, ReactiveFormsModule, TodoStatusSelectComponent, TodoAssignedToSelectComponent],
})
export class TodoFormPage implements ViewWillEnter {
    public todoForm: FormGroup;
    public isLoading = false;
    public isEditMode = false;
    protected readonly statusValues: TodoStatus[] = TODO_STATUS_VALUES.filter(s => s !== 'deleted');
    public readonly isAdmin = computed(() => this.SessionService.user()?.role === 'admin');
    private todoId: ITodo['_id'] | null = null;

    constructor(
        private FormBuilder: FormBuilder,
        private Router: Router,
        private ActivatedRoute: ActivatedRoute,
        private Location: Location,
        private TodoGatewayService: TodoGatewayService,
        private CommonService: CommonService,
        private SessionService: SessionService,
    ) {
        this.todoForm = this.FormBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            deadline: ['', [Validators.required]],
            status: ['pending', [Validators.required]],
            assigned_to: [null],
        });

        addIcons({ saveSharp, refreshSharp, arrowBackSharp });
    }

    public ionViewWillEnter(): void {
        this.todoId = this.ActivatedRoute.snapshot.paramMap.get('id');
        this.isEditMode = !!this.todoId;
        if (this.isEditMode) {
            this.loadTodo();
        } else {
            this.todoForm.reset({
                title: '',
                description: '',
                deadline: '',
                status: 'pending',
                assigned_to: null,
            });
        }
    }

    private loadTodo(): void {
        if (!this.todoId) return;
        this.isLoading = true;
        this.TodoGatewayService.getOne(this.todoId).subscribe({
            next: (res) => {
                const todo: ITodo = res?.data;
                const deadlineValue = todo?.deadline
                    ? new Date(todo.deadline).toISOString().slice(0, 16)
                    : '';
                this.todoForm.patchValue({
                    title: todo?.title ?? '',
                    description: todo?.description ?? '',
                    deadline: deadlineValue,
                    status: todo?.status ?? 'pending',
                    assigned_to: todo?.assigned_to?._id ?? todo?.assigned_to ?? null,
                });
            },
            error: (error: { error?: { message?: string } }) => {
                this.CommonService.createToast({
                    message: error?.error?.message ?? 'Failed to load todo',
                    duration: 2,
                    color: 'danger',
                });
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    public submitForm = (): void => {
        if (this.todoForm.invalid) return;
        this.isLoading = true;

        const formValue = this.todoForm.value;
        const payload: Partial<ITodo> = {
            title: formValue.title,
            description: formValue.description,
            deadline: formValue.deadline ? new Date(formValue.deadline) : undefined,
            status: formValue.status,
            assigned_to: formValue.assigned_to ?? null,
        };

        if (this.isEditMode && this.todoId) {
            this.TodoGatewayService.updateTodo({ _id: this.todoId, ...payload } as ITodo).subscribe({
                next: () => {
                    this.CommonService.createToast({
                        message: 'Todo updated successfully',
                        duration: 2,
                        color: 'success',
                    });
                    this.goBack();
                },
                error: (error: { error?: { message?: string } }) => {
                    this.CommonService.createToast({
                        message: error?.error?.message ?? 'Failed to update todo',
                        duration: 2,
                        color: 'danger',
                    });
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
        } else {
            this.TodoGatewayService.createTodo(payload as ITodo).subscribe({
                next: () => {
                    this.CommonService.createToast({
                        message: 'Todo created successfully',
                        duration: 2,
                        color: 'success',
                    });
                    this.goBack();
                },
                error: (error: { error?: { message?: string } }) => {
                    this.CommonService.createToast({
                        message: error?.error?.message ?? 'Failed to create todo',
                        duration: 2,
                        color: 'danger',
                    });
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
        }
    };

    public goBack = (): void => {
        this.Location.back();
    };
}
