import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from 'src/app/_services/notes.service';
import { NoteHead, NotesMsg } from 'src/app/_types/User';
import { c20 } from '../emscripten/c20wasm';
import { EmscriptenWasmComponent } from '../emscripten/emscripten-wasm.component';
import { UserinfoService } from '../../_services/userinfos.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent  extends EmscriptenWasmComponent<c20>   implements OnInit {

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
  authdata_make:string='';
  waiter=0;
  named_notes_heads:NoteHead[];
  constructor(
    public notes_serv:NotesService,
    private ngzone:NgZone,
    private userinfo:UserinfoService,
  ) {
    super("Cc20Module", "notes.js");

    // Authenticated messages
    this.authdata = this.userinfo.authdata_stream.subscribe(
      data=>{
        this.authdata_make = data.toString();
        console.log("NOTES COMPONENT authdata: "+ this.authdata_make);
      }
    );

  }

  ngOnInit(){
    // Current notes messages
    console.log("oninit for notes");
    this.notes_subject = this.notes_serv.notesSubject.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        console.log("NOTES COMPONENT recieved content: "+ JSON.stringify(this.notes_obj));
        if(this.notes_obj.ntype == "retrieve_return" ){
          console.log("NOTES COMPONENT recieved retrival result for note "+ this.notes_obj.note_id
          +"\n\tStatus: "+ this.notes_obj.status);
          if(this.notes_obj.content !=null){
            this.content = this.dec(this.notes_obj.content.toString());
            this.change(this.content);
          }
          else {
            this.content = "";
            this.change(this.content);
          }
          if(this.notes_obj.head != null){
            this.notes_serv.setHead(this.notes_obj.head);
            this.head_content = this.dec(this.notes_obj.head.toString());
          }
          else {
            this.head_content = "";
            this.notes_serv.setHead("");
          }
        }
        else if (this.notes_obj.ntype == "heads_return" ){
          console.log("Notes,  nav");
          this.named_notes_heads=JSON.parse(JSON.stringify(this.notes_obj.content));
          this.dec_heads();
          this.notes_obj.content=JSON.stringify(this.named_notes_heads);
          this.notes_serv.set_nav_head(this.notes_obj);
          console.log("Notes, done pushing the heads to nav");
        }
      }
    );
  }
  dec_heads(){
    let i=0;
    for (i=0;i<this.named_notes_heads.length;i++){
    this.named_notes_heads[i].id = Number(this.named_notes_heads[i].note_id);
      if(this.named_notes_heads[i].head == null){
        this.named_notes_heads[i].head = "unnamed note";
      }
      else {
        this.named_notes_heads[i].head = this.dec(this.named_notes_heads[i].head.toString());
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
      }, 2000);
    }
  }

  editHead(){
    this.notes_serv.setHead(this.enc(this.head_content));
    this.head_content_ref.nativeElement.blur();
    this.content_ref.nativeElement.focus();
  }
  toggleRightSidenav() {
    this.notes_serv.toggle();
  }

  change(a:String){
    console.log("content change");
    if(a!=null){
      this.notes_serv.setCurContent(this.enc(a.toString()));
    }
    else{ // empty note
      this.notes_serv.setCurContent("");
    }
  }

  ngOnDestroy(){
    this.notes_subject.unsubscribe();
    this.authdata.unsubscribe();
  }
  public enc (inp:string){
    if(this.module==null || this.authdata_make==''){
      return "unable to encrypt!"
    }
    if(inp.length==0){
      return '';
    }
    return this.module.loader_check(this.authdata_make,inp);
  }

  public dec (inp:string){
    if(this.module==null ){
      return "unable to decrypt!"
    }
    if(this.authdata_make==''){
      return "unable to decrypt! No password."
    }
    if(inp.length==0){
      return '';
    }
    return this.module.loader_out(this.authdata_make,inp);
  }
  public msg_hash(inp:string){
    if(this.module==null){
      return "unable to get hash of \""+inp+"\"!"
    }
    return this.module.get_hash(inp);
  }
}
