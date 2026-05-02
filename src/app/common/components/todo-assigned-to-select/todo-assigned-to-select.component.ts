import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personSharp } from 'ionicons/icons';
import { AppModule } from 'src/app/app.module';
import { IUser } from 'src/app/types/api.types';
import { userGatewayService } from 'src/app/user-management/services/user-gateway.service';

@Component({
    selector: 'app-todo-assigned-to-select',
    templateUrl: './todo-assigned-to-select.component.html',
    standalone: true,
    imports: [AppModule, IonicModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TodoAssignedToSelectComponent),
            multi: true,
        },
    ],
})
export class TodoAssignedToSelectComponent implements ControlValueAccessor, OnInit {
    @Input() public value: IUser['_id'] | null = null;
    @Input() public disabled = false;
    @Output() public assignedToChange = new EventEmitter<IUser['_id'] | null>();

    public users: IUser[] = [];
    public isLoading = false;
    public hasError = false;

    private onChange: (val: IUser['_id'] | null) => void = () => {};
    private onTouched: () => void = () => {};

    constructor(private UserGatewayService: userGatewayService) {}

    public ngOnInit(): void {
        addIcons({ personSharp });
        this.loadUsers();
    }

    private loadUsers(): void {
        this.isLoading = true;
        this.hasError = false;
        this.UserGatewayService.getUsers().subscribe({
            next: (res: any) => {
                this.users = res?.data ?? [];
            },
            error: () => {
                this.hasError = true;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    public retryLoad(): void {
        this.loadUsers();
    }

    public onIonChange(event: CustomEvent<{ value: IUser['_id'] | null }>): void {
        const newVal = event.detail?.value ?? null;
        this.value = newVal;
        this.onChange(newVal);
        this.onTouched();
        this.assignedToChange.emit(newVal);
    }

    public writeValue(val: IUser['_id'] | null): void {
        this.value = val ?? null;
    }

    public registerOnChange(fn: (val: IUser['_id'] | null) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
