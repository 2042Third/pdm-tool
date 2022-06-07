import { ServerMsg } from './../_types/ServerMsg';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import {  MatDialogRef } from '@angular/material/dialog';
import { DialogNotificationsComponent } from '../platform/dialogNotifications/dialogNotifications.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Injectable({ providedIn: 'root' })
export class AuthService {
    // private userSubject: BehaviorSubject<ServerMsg>;
    // public signupSubject: BehaviorSubject<ServerMsg>;
    private userSubject: Subject<ServerMsg> = new Subject<ServerMsg>();
    public signupSubject: Subject<ServerMsg> = new Subject<ServerMsg>();

    dialogRef:MatDialogRef<DialogNotificationsComponent, any>;
    dialogConfig = new MatDialogConfig();
    private signup_obj:ServerMsg=new ServerMsg;
    public user: Observable<ServerMsg>;
    private data_store:{latestMsg:ServerMsg} = {latestMsg:new ServerMsg};
    constructor(
      private router: Router,
      public dialog: MatDialog,
      private http: HttpClient,
    ) {
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.data = {dialogType:"Login Failed", message:"No account found. Please, check your email and password. "};
      this.dialogConfig.panelClass= 'custom-modalbox';
    }

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
            if (authData.status == "fail"){
              this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
            }
            localStorage.setItem('user', JSON.stringify(window.btoa(umail + ':' + upw)));
            this.data_store.latestMsg = authData;
            this.userSubject.next(Object.assign({}, this.data_store).latestMsg);
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
