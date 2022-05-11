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
    public signupSubject: BehaviorSubject<ServerMsg>;

    private signup_obj:ServerMsg=new ServerMsg;
    public user: Observable<User>;
    constructor(
        private router: Router,
        private userinfo: UserinfoService,
        private http: HttpClient
    ) {
      this.signup_obj.v1='';
      this.signup_obj.v2='';
      this.signup_obj.v3='';
      this.signup_obj.v4='';
      this.signupSubject =new BehaviorSubject<ServerMsg>(this.signup_obj);
      this.userinfo.set_signin_status( JSON.parse(localStorage.getItem('user')));
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }


    signup(uname:string ,umail: string, upw: string) {
      console.log("making request for signup");
        return this.http.post<ServerMsg>(
      'https://pdm.pw/auth/register', { "uname":uname,"umail":umail, "upw":upw, "type":"pdm web" })
            .pipe(map(upData => {
              this.signupSubject.next(upData);
              return upData;
            }));
    }

    login(umail: string, upw: string) {
      var authd;
        return this.http.post<User>(
      'https://pdm.pw/auth/signin', { "umail":umail, "upw":upw })
            .pipe(map(authData => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                // authd = window.btoa(umail + ':' + upw);
                // authData.authdata = window.btoa(umail + ':' + upw);
                localStorage.setItem('user', JSON.stringify(window.btoa(umail + ':' + upw)));
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
