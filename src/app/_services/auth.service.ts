import { ServerMsg } from './../_types/ServerMsg';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User} from '../_types/User';
import { UserinfoService } from './userinfo.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private userinfo: UserinfoService,
        private http: HttpClient
    ) {
      this.userinfo.set_signin_status( JSON.parse(localStorage.getItem('user')));
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(umail: string, upw: string) {
        return this.http.post<ServerMsg>(
      'https://pdm.pw/auth/signin', { "umail":umail, "upw":upw })
            .pipe(map(authData => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                authData.authdata = window.btoa(umail + ':' + upw);
                localStorage.setItem('user', JSON.stringify(authData));
                this.userSubject.next(authData);
                return authData;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}
