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
  wait_and_check=false;
  waiter=0;
  constructor(
    public notes_serv:NotesService,
    private ngzone:NgZone,
  ) {
    this.notes_subject = notes_serv.notesSubject.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        console.log("NOTES COMPONENT recieved content: "+ this.notes_obj.content);
        if(this.notes_obj.ntype == "retrieve_return" ){
          console.log("NOTES COMPONENT recieved retrival result for note "+ this.notes_obj.note_id
          +"\nStatus: "+ this.notes_obj.status);
        }
      }
    );

  }
/**
   * By Yi Yang, June 6, 2022
   * For pdm, notes syncing.
   *
  */
  public notesSave() {
    this.wait_and_check=false;
    if(this.change_no_wait){
      this.change_no_wait = false;
      this.waitAndCheck();
    }
    else {
      return;
    }
  }
/**
   * By Yi Yang, June 6, 2022
   * For pdm, notes syncing.
   *
  */
  public waitAndCheck (){
    this.waiter=this.waiter+1;
    if(!this.wait_and_check){ // set to check in 2 seconds, and stop others from checking
      this.wait_and_check=true;
      console.log("waiting: "+this.waiter);
      setTimeout(() => {
        if(this.wait_and_check){
          this.change(this.keyword);
          this.change_no_wait = true;
          this.wait_and_check = false;
        }
        else {
          this.waitAndCheck();
        }
      }, 2000);
    }
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
