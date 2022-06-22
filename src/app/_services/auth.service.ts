
import { ServerMsg } from './../_types/ServerMsg';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

// import { HTTP } from '@awesome-cordova-plugins/plugins/';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Http, HttpResponse } from '@capacitor-community/http';
import {  MatDialogRef } from '@angular/material/dialog';
import { DialogNotificationsComponent } from '../platform/dialogNotifications/dialogNotifications.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Injectable({ providedIn: 'root' })
export class AuthService {
  Adetails = navigator.userAgent;
  regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  ThisIsMobileDevice = this.regexp.test(this.Adetails);
    // private userSubject: BehaviorSubject<ServerMsg>;
    // public signupSubject: BehaviorSubject<ServerMsg>;
    public userSubject: Subject<ServerMsg> = new Subject<ServerMsg>();
    public signupSubject: Subject<ServerMsg> = new Subject<ServerMsg>();

    dialogRef:MatDialogRef<DialogNotificationsComponent, any>;
    dialogConfig = new MatDialogConfig();
    dialogConfigSuccess = new MatDialogConfig();
    dialogConfigFail = new MatDialogConfig();
    private signup_obj:ServerMsg=new ServerMsg;
    public user: Observable<ServerMsg>;
    private data_store:ServerMsg;
    constructor(
      private router: Router,
      public dialog: MatDialog,
      private http: HTTP,
      // private http: HttpClient,
    ) {
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.data = {dialogType:"Sign in failed", message:"Check your email and password."};
      this.dialogConfig.panelClass= 'custom-modalbox';
      this.dialogConfigSuccess.autoFocus = true;
      this.dialogConfigSuccess.data = {dialogType:"Sign up success!", message:"Check your email to finish the registration."};
      this.dialogConfigSuccess.panelClass= 'custom-modalbox';
      this.dialogConfigFail.autoFocus = true;
      this.dialogConfigFail.data = {dialogType:"Sign up Failed", message:"No account can be made at this point. Please, check back at a later time. "};
      this.dialogConfigFail.panelClass= 'custom-modalbox';
    }

    signup(uname:string ,umail: string, upw: string) {
      return from(this.http.post(
      'https://pdm.pw/auth/register', { "uname":uname,"umail":umail, "upw":upw, "type":"pdm web" },{}))
            .pipe(map(upData => {
              if(upData.data.status == "success"){
                this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfigSuccess);
              }
              else {
                this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfigFail);

              }
              this.signupSubject.next(upData.data);
              return upData;
            }));
    }

    login(umail: string, upw: string) {
      let temp = { "umail":umail, "upw":upw };


      return from(this.http.post(
        'https://pdm.pw/auth/signin',temp,{}))
        .pipe(map(authData => {
          if (authData.data.status == "fail"){
            this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
          }

          localStorage.setItem('user', JSON.stringify(window.btoa(umail + ':' + upw)));
          this.data_store = JSON.parse(JSON.stringify(authData.data));
          this.userSubject.next(this.data_store);
          return authData.data;
      }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

}
