import { Component, NgZone, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from 'src/app/_services/notes.service';
import { NotesMsg } from 'src/app/_types/User';
import { c20 } from '../emscripten/c20wasm';
import { EmscriptenWasmComponent } from '../emscripten/emscripten-wasm.component';
import { UserinfoService } from '../../_services/userinfos.service';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent  extends EmscriptenWasmComponent<c20> {
  nt_disabled = false;
  notes_subject : Subscription;
  notes_obj : NotesMsg;
  content:String;
  keyword:string;
  change_no_wait=true;
  wait_and_check=false;
  authdata:Subscription;
  authdata_make:string='';
  waiter=0;
  constructor(
    public notes_serv:NotesService,
    private ngzone:NgZone,
    private userinfo:UserinfoService,
  ) {
    super("Cc20Module", "notes.js");
    // Current notes messages
    this.notes_subject = notes_serv.notesSubject.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        console.log("NOTES COMPONENT recieved content: "+ this.notes_obj.content);
        if(this.notes_obj.ntype == "retrieve_return" ){
          console.log("NOTES COMPONENT recieved retrival result for note "+ this.notes_obj.note_id
          +"\n\tStatus: "+ this.notes_obj.status);
          this.content = this.dec(this.notes_obj.content.toString());
        }
      }
    );
    // Authenticated messages
    this.authdata = this.userinfo.authdata_stream.subscribe(
      data=>{
        this.authdata_make = data.toString();
        console.log("NOTES COMPONENT authdata: "+ this.authdata_make);
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


  toggleRightSidenav() {
    this.notes_serv.toggle();
  }

  change(a:String){
    console.log("content change");
    this.notes_serv.setCurContent(this.enc(a.toString()));
  }

  ngOnInit() {
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
    if(this.module==null || this.authdata_make==''){
      return "unable to decrypt!"
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
