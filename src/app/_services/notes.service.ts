import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotesMsg } from '../_types/User';
import { UserinfoService } from './userinfo.service';
import { ServerMsg } from '../_types/ServerMsg';

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
  constructor(
    private http: HttpClient,
    private userinfo: UserinfoService,
    ) {
      this.notesSubject =new BehaviorSubject<NotesMsg>(this.notes_obj);
      this.feature_sub = this.userinfo.signin_status.subscribe(
      data=>{
        // this.signin_stat_str=" \n\t";
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

  public new_note(){

    console.log("Attampt new note");
    return this.http.post<NotesMsg>(
    'https://pdm.pw/auth/note',
    { "username":"test1",
      "content":this.notes_obj.content,
      "sess":"sess none",
      "ntype":"new",
      "email":"18604713262@163.com",
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
