import { query } from "@angular/animations";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from "src/app/types/api.types";
import { environment } from 'src/environments/environment';
// import { User } from '../interfaces/auth';

@Injectable({
    providedIn: 'root',
})
export class userGatewayService {
    constructor(private HttpClient: HttpClient) { }

    public getUsers = (params?: { query_string?: string, user_type?: IUser["user_type"] | 'all' }) => {

        const searchParams = new URLSearchParams();
        if (params?.query_string) searchParams.set('query_string', params.query_string);
        if (params?.user_type && params.user_type !== 'all') searchParams.set('user_type', params.user_type);

        return this.HttpClient.get(
            `${environment.api_url}/user${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
        );
    }
    public getOne = (payload: { _id: IUser["_id"] }) => {
        return this.HttpClient.get(
            `${environment.api_url}/user/${payload._id}`
        );
    }
    public updateUser = (payload: { user_id: IUser["_id"], userData: Partial<IUser> }) => {
        return this.HttpClient.put(
            `${environment.api_url}/user/${payload.user_id}`,
            payload.userData
        );
    }
    public createUser = (payload: Omit<IUser, '_id' | 'deleted_at'>) => {
        return this.HttpClient.post(
            `${environment.api_url}/user`,
            payload
        );
    }
    public updateUserType = (payload: { _id: IUser["_id"]; user_type: IUser["user_type"] }) => {
        return this.HttpClient.put(
            `${environment.api_url}/user/${payload._id}`,
            payload
        );
    }
    public deleteUser = (payload: { _id: IUser["_id"] }) => {
        return this.HttpClient.delete(
            `${environment.api_url}/user/${payload._id}`,
        );
    }

}