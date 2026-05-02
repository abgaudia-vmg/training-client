export interface IUser {
    _id: any;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    user_type: 'staff' | 'admin';
    deleted_at: Date | null;
}

export type TodoStatus = 'pending' | 'in progress' | 'completed' | 'cancelled' | 'deleted';

export const TODO_STATUS_VALUES: TodoStatus[] = ['pending', 'in progress', 'completed', 'cancelled', 'deleted'];

export const TODO_STATUS_ICON: Record<TodoStatus, string> = {
    'pending':     'time-sharp',
    'in progress': 'sync-sharp',
    'completed':   'checkmark-circle-sharp',
    'cancelled':   'close-circle-sharp',
    'deleted':     'trash-sharp',
};

export const TODO_STATUS_COLOR: Record<TodoStatus, string> = {
    'pending':     'text-yellow-500',
    'in progress': 'text-blue-500',
    'completed':   'text-green-500',
    'cancelled':   'text-gray-400',
    'deleted':     'text-red-500',
};

export interface ITodo {
    _id: any;
    title: string;
    description: string;
    deadline: Date;
    status: TodoStatus;
    created_by: any;
    assigned_to: any;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
    completed_at?: Date | null;
}