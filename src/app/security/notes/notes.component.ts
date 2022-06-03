import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from 'src/app/_services/notes.service';
import { NotesMsg } from 'src/app/_types/User';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  content="";
  nt_disabled = false;

  notes_subject : Subscription;
  notes_obj : NotesMsg;
  constructor(
  private notes_serv:NotesService,
  ) {
    this.notes_subject = notes_serv.notesSubject.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        console.log("NOTES COMPONENT recieved content: "+ this.notes_obj.content);
      }
    );
  }
  toggleRightSidenav() {
    this.notes_serv.toggle();
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.notes_subject.unsubscribe();
  }

}
