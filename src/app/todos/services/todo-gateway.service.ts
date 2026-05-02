import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITodo, TodoStatus } from 'src/app/types/api.types';
import { environment } from 'src/environments/environment';

export interface TodoFilterParams {
    query_string?: string;
    status?: TodoStatus | 'all';
}

@Injectable({
    providedIn: 'root',
})
export class TodoGatewayService {
    constructor(private HttpClient: HttpClient) { }

    private buildSearchParams(params?: TodoFilterParams): string {
        const searchParams = new URLSearchParams();
        if (params?.query_string) searchParams.set('query_string', params.query_string);
        if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
        const query = searchParams.toString();
        return query ? `?${query}` : '';
    }

    public getMyTodos = (params?: TodoFilterParams) => {
        return this.HttpClient.get<{ success: boolean; data: ITodo[] }>(
            `${environment.api_url}/todo/my-todos${this.buildSearchParams(params)}`,
        );
    };

    public getAllTodos = (params?: TodoFilterParams) => {
        return this.HttpClient.get<{ success: boolean; data: ITodo[] }>(
            `${environment.api_url}/todo${this.buildSearchParams(params)}`,
        );
    };

    public getAllTodosPerUser = (userId: string, params?: TodoFilterParams) => {
        return this.HttpClient.get<{ success: boolean; data: ITodo[] }>(
            `${environment.api_url}/todo/all-per-user/${userId}${this.buildSearchParams(params)}`,
        );
    };


    public getOne = (todoId: string) => {
        return this.HttpClient.get<{ success: boolean; data: ITodo }>(
            `${environment.api_url}/todo/${todoId}`,
        );
    };

    public createTodo = (todo: ITodo) => {
        return this.HttpClient.post<{ success: boolean; data: ITodo }>(
            `${environment.api_url}/todo`,
            todo,
        );
    };

    public updateTodo = (todo: ITodo) => {
        return this.HttpClient.put<{ success: boolean; data: ITodo }>(
            `${environment.api_url}/todo/${todo._id}`,
            todo,
        );
    };

    public deleteTodo = (todoId: string) => {
        return this.HttpClient.delete<{ success: boolean; data: ITodo }>(
            `${environment.api_url}/todo/${todoId}`,
        );
    };
}
