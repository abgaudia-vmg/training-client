import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { timeSharp, syncSharp, checkmarkCircleSharp, closeCircleSharp, trashSharp } from 'ionicons/icons';
import { AppModule } from 'src/app/app.module';
import { TODO_STATUS_COLOR, TODO_STATUS_ICON, TODO_STATUS_VALUES, TodoStatus } from 'src/app/types/api.types';

@Component({
    selector: 'app-todo-status-select',
    templateUrl: './todo-status-select.component.html',
    standalone: true,
    imports: [AppModule, IonicModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TodoStatusSelectComponent),
            multi: true,
        },
    ],
})
export class TodoStatusSelectComponent implements ControlValueAccessor, OnInit {
    @Input() public value: TodoStatus | null = null;
    @Input() public disabled = false;
    @Output() public statusChange = new EventEmitter<TodoStatus | null>();
    public readonly statusOptions: TodoStatus[] = TODO_STATUS_VALUES.filter(s => s !== 'deleted');
    public readonly statusIcon = TODO_STATUS_ICON;
    public readonly statusColor = TODO_STATUS_COLOR;

    private onChange: (val: TodoStatus | null) => void = () => { };
    private onTouched: () => void = () => { };

    public ngOnInit(): void {
        addIcons({ timeSharp, syncSharp, checkmarkCircleSharp, closeCircleSharp, trashSharp });
    }

    public getStatusIcon(status: TodoStatus | null): string {
        return status ? (this.statusIcon[status] ?? '') : '';
    }

    public getStatusColor(status: TodoStatus | null): string {
        return status ? (this.statusColor[status] ?? '') : '';
    }

    public onIonChange(event: CustomEvent<{ value: TodoStatus }>): void {
        const newVal = event.detail?.value ?? null;
        this.value = newVal;
        this.onChange(newVal);
        this.onTouched();
        this.statusChange.emit(newVal);
    }

    public writeValue(val: TodoStatus | null): void {
        this.value = val ?? null;
    }

    public registerOnChange(fn: (val: TodoStatus | null) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
