import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotesMsg } from '../_types/User';
import { UserinfoService } from './userinfos.service';
import { ServerMsg } from '../_types/ServerMsg';
import {  MatDialogRef } from '@angular/material/dialog';
import { DialogNotificationsComponent } from '../platform/dialogNotifications/dialogNotifications.component';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes_obj:NotesMsg = new NotesMsg();
  public notesSubject: BehaviorSubject<NotesMsg>;
  errorMessage: any;
  feature_sub: Subscription;
  signin_obj: ServerMsg;
  signin_stat_str: String = "Not Signed In";
  signin_stat: boolean = false;
  dialogRef:MatDialogRef<DialogNotificationsComponent, any>;
  dialogConfig = new MatDialogConfig();
  private signup_sub:Subscription;
  constructor(
    private http: HttpClient,
    private userinfo: UserinfoService,
    public dialog: MatDialog,
    private router: Router,
    private ngzone:NgZone,
    ) {
      console.log ("MAKING NOTES SERVICE");
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.data = {dialogType:"Alert", message:"Please log in."};
    this.dialogConfig.panelClass= 'custom-modalbox';
    // signin status
    //   this.signup_sub = this.userinfo.signin_status_value_note.subscribe(
    //   data=>{
    //       // this.signin_obj.sender = data.sender;
    //       this.ngzone.run(()=>{
    //       this.signin_obj = JSON.parse(JSON.stringify(data)); // make a copy
    //       console.log("notes service this.signin_obj="+this.signin_obj);
    //       console.log("notes service this.signin_obj.status="+this.signin_obj.status);
    //       this.signin_stat_str = this.signin_obj.receiver;
    //       if(this.signin_obj.status == "success"){
    //         this.signin_stat = true;
    //       }
    //       else {
    //         this.signin_stat_str="Not Signed In";
    //         this.signin_stat = false;
    //       }
    //     })
    //   })
    // ;
    this.signup_sub = this.userinfo.signin_status_value.subscribe(
      {
        next: data=>{
            // this.signin_obj.sender = data.sender;
            this.signin_obj = JSON.parse(JSON.stringify(data)); // make a copy
            console.log("notes this.signin_obj="+this.signin_obj);
            console.log("notes this.signin_obj.status="+this.signin_obj.status);
            this.signin_stat_str = data.receiver;
            if(this.signin_obj.status != "fail"){
              this.signin_stat = true;
            }
            else {
              // this.signin_stat_str="Not Signed In";
              this.signin_stat = false;
            }
          },
        error: data=>{
          console.log("?");
        }
      }
    )
    ;
    console.log("notes service signin_obj subscribed");
  }
  private sidenav: MatSidenav;
  ngOnInit() {
        // this.ngzone.run(() => {

  }
  openDialog(){
    // dialogConfig.disableClose = true;
  }

  public new_note(){
    console.log("this.signin_stat======>" + this.signin_obj.status+" \\\\ "+this.signin_stat_str);
    if(!this.signin_stat) {
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
      return null;
    }
    return this.ngzone.run(()=>{

    this.notes_obj.ntype = "new";
    return this.http.post<NotesMsg>(
    'https://pdm.pw/auth/note',
    { "username":this.signin_obj.username,
      "content":"",
      "sess":this.signin_obj.sess,
      "ntype":this.notes_obj.ntype,
      "email":this.signin_obj.email,
    }
    )
    .pipe(map(upData => {
      this.notesSubject.next(upData);
      this.notesSubject.complete();
      return upData;
    }))
    })

    ;
  }
  public get_notes_heads(){
    if(!this.signin_stat) {
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
      return null;
    }
    this.notes_obj.ntype = "heads";
    return this.http.post<NotesMsg>(
    'https://pdm.pw/auth/note',
    { "username":this.signin_obj.username,
      "content":"",
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
    this.signup_sub.unsubscribe();
  }
}
