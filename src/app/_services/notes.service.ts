import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { NotesMsg } from '../_types/User';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes_obj:NotesMsg;
  public notesSubject: BehaviorSubject<NotesMsg>;

  constructor(
    private http: HttpClient
    ) {
      this.notesSubject =new BehaviorSubject<NotesMsg>(this.notes_obj);

    }
  private sidenav: MatSidenav;

  public new_note(){
    console.log("Attampt new note");
    return this.http.post<NotesMsg>(
    'https://pdm.pw/auth/note',
    { "username":"test1",
      "content":"",
      "sess":"sess none",
      "ntype":"1",
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
}
