import { Component, NgZone, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from 'src/app/_services/notes.service';
import { NotesMsg } from 'src/app/_types/User';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  nt_disabled = false;
  notes_subject : Subscription;
  notes_obj : NotesMsg;
  content:String;
  keyword:string;
  change_no_wait=true;
  constructor(
    public notes_serv:NotesService,
    private ngzone:NgZone,
  ) {
    this.notes_subject = notes_serv.notesSubject.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        console.log("NOTES COMPONENT recieved content: "+ this.notes_obj.content);
      }
    );

  }

  public notesSave() {
    if(this.change_no_wait){
      this.change_no_wait = false;
    }
    else {
      return;
    }
    setTimeout(() => {
      this.change(this.keyword);
      this.change_no_wait = true;
    }, 2000);
  }

  toggleRightSidenav() {
    this.notes_serv.toggle();
  }

  change(a:String){
    console.log("content change");
    this.notes_serv.setCurContent(a);
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.notes_subject.unsubscribe();
  }

}
