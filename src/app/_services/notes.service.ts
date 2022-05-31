import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotesMsg } from '../_types/User';
import { UserinfoService } from './userinfo.service';
import { ServerMsg } from '../_types/ServerMsg';
import {  MatDialogRef } from '@angular/material/dialog';
import { DialogNotificationsComponent } from '../platform/dialogNotifications/dialogNotifications.component';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes_obj:NotesMsg;
  public notesSubject: BehaviorSubject<NotesMsg>;
  errorMessage: any;
  feature_sub: Subscription;
  signin_obj: ServerMsg;
  signin_stat_str: String = "Not Signed In";
  signin_stat: boolean = false;
  dialogRef:MatDialogRef<DialogNotificationsComponent, any>;
  constructor(
    private http: HttpClient,
    private userinfo: UserinfoService,
    public dialog: MatDialog,
    private router: Router,
    ) {
      this.notesSubject =new BehaviorSubject<NotesMsg>(this.notes_obj);
      this.feature_sub = this.userinfo.signin_status.subscribe(
      data=>{
        if(data != null ){
          this.signin_stat_str = data.receiver;
          if(this.signin_stat_str != null && this.signin_stat_str.length >0){
            this.signin_stat = true;
          }
          else {
            this.signin_stat_str="Not Signed In";
            this.signin_stat = false;
          }
        }
      });


    }
  private sidenav: MatSidenav;
  ngOnInit() {
    // this.router.events
    //   .subscribe(() => {
    //     this.dialogRef.close();
    //   });
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {dialogType:"Alert", message:"Please log in."};
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, dialogConfig);
  }

  public new_note(){
    if(!this.signin_stat) {
      return null;
    }
    return this.http.post<NotesMsg>(
    'https://pdm.pw/auth/note',
    { "username":this.signin_obj.username,
      "content":this.notes_obj.content,
      "sess":this.signin_obj.sess,
      "ntype":this.notes_obj.ntype,
      "email":this.signin_obj.email,
    }
    )
    .pipe(map(upData => {
      this.notesSubject.next(upData);
      return upData;
    }));
  }

  public setSidenav(sidenav: MatSidenav) {
      this.sidenav = sidenav;
  }

  public open() {
      return this.sidenav.open();
  }

  public close() {
      return this.sidenav.close();
  }

  public toggle(): void {
  this.sidenav.toggle();
  }
  ngOnDestroy() {
    this.feature_sub.unsubscribe();
  }
}
