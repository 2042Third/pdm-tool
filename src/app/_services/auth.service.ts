import { ServerMsg } from './../_types/ServerMsg';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User} from '../_types/User';
import { UserinfoService } from './userinfos.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    // private userSubject: BehaviorSubject<ServerMsg>;
    // public signupSubject: BehaviorSubject<ServerMsg>;
    private userSubject: Subject<ServerMsg> = new Subject<ServerMsg>();
    public signupSubject: Subject<ServerMsg> = new Subject<ServerMsg>();

    private signup_obj:ServerMsg=new ServerMsg;
    public user: Observable<ServerMsg>;
    private data_store:{latestMsg:ServerMsg} = {latestMsg:new ServerMsg};
    constructor(
        private router: Router,
        private userinfo: UserinfoService,
        private http: HttpClient,
        private ngzone: NgZone,
    ) {
      console.log("NEW CONSTRUCTION OF THE AUTHORIZATION SERVICE");
      // this.signupSubject =new BehaviorSubject<ServerMsg>(this.signup_obj);
      // this.userinfo.set_signin_status( JSON.parse(localStorage.getItem('user')));
      // this.userSubject = new BehaviorSubject<ServerMsg>(JSON.parse(localStorage.getItem('user')));
      // this.user = this.userSubject.asObservable();
    }

    // public get userValue(): ServerMsg {
    //     return this.userSubject.value;
    // }


    signup(uname:string ,umail: string, upw: string) {
      return this.http.post<ServerMsg>(
      'https://pdm.pw/auth/register', { "uname":uname,"umail":umail, "upw":upw, "type":"pdm web" })
            .pipe(map(upData => {
              this.signupSubject.next(upData);
              return upData;
            }));
    }

    login(umail: string, upw: string) {
      let temp = { "umail":umail, "upw":upw };
        return this.http.post<ServerMsg>(
          'https://pdm.pw/auth/signin',temp)
          .pipe(map(authData => {
          // this.ngzone.run(()=>{
              // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
              // authd = window.btoa(umail + ':' + upw);
              // authData.authdata = window.btoa(umail + ':' + upw);
              localStorage.setItem('user', JSON.stringify(window.btoa(umail + ':' + upw)));
              this.data_store.latestMsg = authData;
              this.userSubject.next(Object.assign({}, this.data_store).latestMsg);
              console.log("auth getting the data");
              // this.userinfo.set_signin_status(Object.assign({}, this.data_store).latestMsg);
              // this.userinfo.set_signin_status(Object.assign({}, this.data_store).latestMsg);
              return authData;
          // })
        }))
    ;
    // .pipe(map(authData => {
    //       // this.ngzone.run(()=>{
    //             // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
    //             // authd = window.btoa(umail + ':' + upw);
    //             // authData.authdata = window.btoa(umail + ':' + upw);
    //             localStorage.setItem('user', JSON.stringify(window.btoa(umail + ':' + upw)));
    //           this.data_store.latestMsg = authData;
    //           this.userinfo.set_signin_status(Object.assign({}, this.data_store).latestMsg);
    //             this.userSubject.next(authData);
    //             return authData;
    //       // })
    //         }));
      // return this.http.post<ServerMsg>(
      // 'https://pdm.pw/auth/signin',temp)
      //       .subscribe(authData => {
      //           localStorage.setItem('user', JSON.stringify(window.btoa(umail + ':' + upw)));
      //           this.data_store.latestMsg = JSON.parse(JSON.stringify(authData));
      //           this.userSubject.next(Object.assign({}, this.data_store).latestMsg);
      //           this.userinfo.set_signin_status(Object.assign({}, this.data_store).latestMsg);
      //           return authData;
      //       })
      //       ;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}
