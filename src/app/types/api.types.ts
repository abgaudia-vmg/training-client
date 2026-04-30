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