import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { User } from '../interfaces/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthGatewayService {
    constructor(private HttpClient: HttpClient) { }

    public login = (userDetails: any) => {
        return this.HttpClient.post(
            `${environment.api_url}/auth/login`,
            userDetails
        );
    };

    public resetPassword = ({ username, password }: { username: string, password: string }) => {
        return this.HttpClient.post(
            `${environment.api_url}/auth/reset-password`,
            { username, password }
        );
    };

    public register = (userDetails: any) => {
        return this.HttpClient.post(
            `${environment.api_url}/auth/register`,
            userDetails
        );
    };

    public logout = (userDetails: any) => {
        return this.HttpClient.post(
            `${environment.api_url}/auth/logout`,
            userDetails
        );
    };

    public validateSession = (sessionToken?: string) => {
        return this.HttpClient.get(
            `${environment.api_url}/auth/validate`,
        );
    };

    public getLoggedInUserDetails = () => {
        return this.HttpClient.get(
            `${environment.api_url}/auth/me`,
        );
    };

}