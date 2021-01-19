import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthData } from "../models/authdata.module";


const API_URL = environment.API_URL + 'user/';

@Injectable({providedIn: 'root'})
export class AuthService {

    private token: string;
    private userId: string;
    private username: string;
    private authStatus: boolean = false;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getUserId() {
        return this.userId;
    }

    getUsername() {
        return this.username;
    }

    getAuthStatus() {
        return this.authStatus;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    createUser(username: string, email: string, password: string) {
        const userData: AuthData = {username, email, password};
        this.httpClient.post(API_URL + 'signup/', userData)
            .subscribe(() => {
                this.router.navigate(['/auth/login']);
            }, () => {
                this.authStatusListener.next(false);
            });
    }

    loginUser(email: string, password: string) {
        const userData = {email, password};
        this.httpClient.post<{token: string, expiresIn: number, username: string, userId: string}>(API_URL + 'login/', userData)
            .subscribe(response => {
                if (response.token) {
                    const token = response.token;
                    const expiresDuration = response.expiresIn;
                    const userId = response.userId;
                    const username = response.username;
                    
                    this.token = token;
                    this.userId = userId;
                    this.username = username;
                    this.setTimer(expiresDuration);
                    
                    const now = new Date();
                    const expiresDate = new Date(now.getTime() + expiresDuration * 1000);
                    this.saveAuthData(token, expiresDate, username, userId);

                    this.authStatus = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(['/']);
                }  
            }, () => {
                this.authStatusListener.next(false);
            });
    }

    autoAuthUser() {
        const tokenInformation = this.getAuthData();
        if (!tokenInformation) return;
        
        const now = new Date();
        const expiresIn = tokenInformation.expiresDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.authStatus = true;
            this.userId = tokenInformation.userId;
            this.token = tokenInformation.token;
            this.setTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logoutUser();
        }, duration * 1000);
    }

    logoutUser() {
        this.token = null;
        this.userId = null;
        this.authStatus = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, username: string, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('username', username);
        localStorage.setItem('user', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expiresDate = localStorage.getItem('expiration');
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user');

        if (!token || !expiresDate || !userId) {
            return;
        }
        
        return {token: token, expiresDate: new Date(expiresDate), username: username, userId: userId};
    }

}
