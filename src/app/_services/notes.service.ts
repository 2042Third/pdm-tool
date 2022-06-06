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
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes_obj:NotesMsg = new NotesMsg();
  savestatus="";
  public notesSubject: BehaviorSubject<NotesMsg> = new BehaviorSubject<NotesMsg>(this.notes_obj);
  public notesSaveSubject: BehaviorSubject<String> = new BehaviorSubject<String>(this.savestatus);
  errorMessage: any;
  feature_sub: Subscription;
  signin_obj: ServerMsg;
  signin_stat_str: String = "Not Signed In";
  signin_stat: boolean = false;
  dialogRef:MatDialogRef<DialogNotificationsComponent, any>;
  dialogConfig = new MatDialogConfig();
  private cur_open_note:String;
  private last_save_time:number=-1;
  private last_save_time_str:String="never";
  private last_save_time_diff:number=-1;
  private signup_sub:Subscription;
  public cur_content:String="";
  private sidenav: MatSidenav;
  //debug data
  private debug_str = '{"note_id":"listed","sess":"debugkey","h":"listed","ntype":"heads_return","content":[{"head":null,"note_id":"5"},{"head":null,"note_id":"6"},{"head":null,"note_id":"7"},{"head":null,"note_id":"8"},{"head":null,"note_id":"9"},{"head":null,"note_id":"10"},{"head":null,"note_id":"11"}],"email":"18604713262@163.com","hash":"ee741763ee120d70254401bba3384388bb43c3270394f16998cb9af64c0e4b1d","status":"success"}';
  private debug_obj:NotesMsg = JSON.parse(this.debug_str);
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
      // User signin status
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
              this.signin_stat = false;
            }
          },
        error: data=>{
          console.log("?");
        }
      }
    );
    console.log("notes service signin_obj subscribed");
  }
  ngOnInit() {

  }

  openDialog(){
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
  }

  /**
   * DEBUG ONLY.
   * Pushes hard-coded packet to the observer.
   * Imitating a server's response after a heads' call.
   *
  */
  public debug_push_note_msg(){
    // this.ngzone.run(()=>{
      this.notesSubject.next(this.debug_obj);
    // });
  }
  /**
   * Push the current note's update to the server
   *
  */
  public liveUpdateNote(){
    if(!this.signin_stat) {
      if(!environment.production){
        console.log("Current content: \n\'\'\'\n"+this.cur_content+"\'\'\'");
        return null;
      }
      this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
      return null;
    }
    return this.ngzone.run(()=>{
      this.notes_obj.ntype = "update";
      return this.http.post<NotesMsg>(
      'https://pdm.pw/auth/note',
      { "username":this.signin_obj.username,
        "content":this.cur_content,
        "sess":this.signin_obj.sess,
        "ntype":this.notes_obj.ntype,
        "email":this.signin_obj.email,
        "note_id":this.cur_open_note,
      }).pipe(map(upData => {
        this.notesSubject.next(upData);
        if(this.last_save_time==-1){
          this.last_save_time = Number(upData.time);
        }
        else {
          this.last_save_time_diff=Number(upData.time) -this.last_save_time;
          this.last_save_time_str="saved "+this.last_save_time_diff+" ago";
          this.last_save_time = Number(upData.time);
          this.notesSaveSubject.next(this.last_save_time_str);
        }
        return upData;
      }))
    });
  }

  public new_note(){
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
      }).pipe(map(upData => {
        this.notesSubject.next(upData);
        return upData;
      }))
    });
  }
  /**
   * Get the heads of all the notes for this user
   *
  */
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

  /**
   * Get the note given the note id
   *
  */
  public get_note(a:String){
    if(!this.signin_stat) {
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, this.dialogConfig);
      return null;
    }
    this.notes_obj.ntype = "retrieve";
    return this.http.post<NotesMsg>(
    'https://pdm.pw/auth/note',
    { "username":this.signin_obj.username,
      "content":"",
      "sess":this.signin_obj.sess,
      "ntype":this.notes_obj.ntype,
      "email":this.signin_obj.email,
      "note_id":a,
    }
    )
    .pipe(map(upData => {
      this.notesSubject.next(upData);
      if(upData.status == "success"){
        this.cur_open_note = upData.note_id;
      }
      return upData;
    }));
  }

  public setCurContent(a:String){
    this.cur_content = a;
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
