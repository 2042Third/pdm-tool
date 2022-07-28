import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from 'src/app/_services/notes.service';
import { NoteHead, NotesMsg } from 'src/app/_types/User';
import { UserinfoService } from '../../_services/userinfos.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent   implements OnInit {

  @ViewChild('headContent') head_content_ref: ElementRef;
  @ViewChild('mainContent') content_ref: ElementRef;
  nt_disabled = false;
  notes_subject : Subscription;
  notes_obj : NotesMsg;
  content:String;
  keyword:string;
  change_no_wait=true;
  wait_and_check=false;
  authdata:Subscription;
  head_content="";
  waiter=0;
  named_notes_heads:NoteHead[];
  attampted_loading=false;
  note_status: String;
  errorMessage: any;
  has_change = false;
  head_placeholder: string = "";
  constructor(
    public notes_serv:NotesService,
    private ngzone:NgZone,
    private userinfo:UserinfoService,
  ) {


  }

  ngOnInit(){
    // Current notes messages
    this.notes_subject = this.notes_serv.notesSubject.subscribe({
        next: data => {// BEGIN subscribe
          let cur_timeout = this.notes_serv.loadingTimeout;
          this.notes_obj = JSON.parse(JSON.stringify(data));
          setTimeout(() => {
            console.log("NOTES COMPONENT recieved content: " + JSON.stringify(this.notes_obj));
            if (this.notes_obj.ntype == "retrieve_return") {
              console.log("NOTES COMPONENT recieved retrival result for note " + this.notes_obj.note_id
                + "\n\tStatus: " + this.notes_obj.status);
              if (this.notes_obj.content != null) {
                this.content = this.userinfo.dec(this.notes_obj.content.toString());
                this.change(this.content);
              } else {
                this.content = "";
                this.change(this.content);
              }
              if (this.notes_obj.head != null) {
                this.notes_serv.setHead(this.notes_obj.head);
                this.head_content = this.userinfo.dec(this.notes_obj.head.toString());
              } else {
                this.head_placeholder = "Untitled Note " + this.notes_obj.note_id
                this.head_content = "";
                this.notes_serv.setHead("");
              }
            } else if (this.notes_obj.ntype == "heads_return") {
              console.log("Notes,  nav");
              this.named_notes_heads = JSON.parse(JSON.stringify(this.notes_obj.content));
              this.dec_heads();
              this.notes_obj.content = JSON.stringify(this.named_notes_heads);
              this.notes_serv.set_nav_head(this.notes_obj);

              console.log("Notes, done pushing the heads to nav");
            }
          }, 10);
        },// END subscribe
        error: data => {
          console.log("Notes error "+ data.message);
          this.userinfo.openDialog('Notes Error: unkown. \n'+data.message);
        }
      }
    );
  }
  dec_heads(){
    let i=0;
    for (i=0;i<this.named_notes_heads.length;i++){
    this.named_notes_heads[i].id = Number(this.named_notes_heads[i].note_id);
      if(this.named_notes_heads[i].head == null){
        this.named_notes_heads[i].head = "Untitled Note "+this.named_notes_heads[i].id;
      }
      else {
        this.named_notes_heads[i].head = this.userinfo.dec(this.named_notes_heads[i].head.toString());
      }
      this.named_notes_heads[i].utime = formatDate(Number(this.named_notes_heads[i].update_time)*1000, "medium",'en-US' ).toString();
    }
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
          this.change(this.content);
          this.change_no_wait = true;
          this.wait_and_check = false;
        }
        else {
          this.waitAndCheck();
        }
      }, this.notes_serv.submitTimeout);
    }
  }

  editHead(){
    this.has_change = true;
    this.notes_serv.setHead(this.userinfo.enc(this.head_content));
    this.head_content_ref.nativeElement.blur();
    this.content_ref.nativeElement.focus();
  }
  toggleRightSidenav() {
    this.notes_serv.toggle();
  }

  change(a:String){
    console.log("content change");
    this.has_change = true;
    if(a!=null){
      this.notes_serv.setCurContent(this.userinfo.enc(a.toString()));
    }
    else{ // empty note
      this.notes_serv.setCurContent("");
    }
  }
  updateNote(){
    console.log("Updating note ");
    this.notes_serv.liveUpdateNote().subscribe({
          next: data => {
            this.note_status=data.note_id;
            console.log(this.note_status);
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
      });
  }
  ngOnDestroy(){
    if( this.userinfo.pass_is_set() && this.has_change){
      if(this.content != "" || this.head_content !=""){
        this.change(this.content);
        this.editHead();
        this.updateNote();
      }
    }
    this.notes_subject.unsubscribe();
  }

}
