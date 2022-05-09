import { Component, SecurityContext } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";
import { WebsockService } from "src/app/websock/websock.service";
import { catchError, map, Observable, tap } from "rxjs";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl } from "@angular/forms";
import { DisableControlDirective } from '../disableControl.directive';
import { NamedServerMsg, NamedServerMsgA } from '../../_types/ServerMsg';

import { ChatService } from 'src/app/_services/chat.service';

interface MyEmscriptenModule extends EmscriptenModule {
  loader_check(a:string,inp: string): string;
  loader_out(a:string,inp: string): string;
  get_hash(inp: string): string;
}

type none_init_msg = {
  msg: string;
  u1: string;
  u2: string;
  a:string;
};

@Component({
  selector: 'security-cc20',
  templateUrl: './cc20.component.html',
  styleUrls: ['./cc20.component.scss']
})
export class Cc20Component extends EmscriptenWasmComponent<MyEmscriptenModule> {
  a:string="1234";
  loaded:boolean=false;
  val:string;
  submitting:boolean=true;
  no_submit:boolean=false;
  msg='';
  _term='';
  formControl;
  remake=0;
  constructor(
    private sock: WebsockService,
    private sr: DomSanitizer,
    private chatservice: ChatService
  ) {
    super("Cc20Module", "notes.js");
    if(this.sock.connected){
      this.sock.socket.onmessage = function (incoming) {
        var a:string = incoming.data;
        console.log(a);
        var request = JSON.parse(a);
        switch(request["type"]){
          // case "regi_ack":
          //   this.append_terminal_gr("服务器已连接！");

          // break;
          // case "msg":
          //   this.append_terminal_gr("服务器已连接！");

          // break;
          case "hello":
            $("#output").append("<font color=\"green\">"
              +"服务器已连接!"
              +"</font></br>");
          break;
          default:
            console.log('unknown type message received');
          break;
        }
      };
    }
    this.formControl = new FormControl({value: '', disabled: this.no_submit});
  }

  ngOnInit() {
  }

  ngAfterContentChecked(){
    if(this.remake === 0){
      if(this.module!=null){
        this.load_hist();
        this.remake=1;
      }
    }

  }
  ngAfterViewChecked(){
    if (this.remake === 1){
      if(document.getElementById("output")!=null){
        this.scroll_to_new();
        this.remake = 2;
      }
    }
  }

  handleSubmit(e){
    this.msg_send();
    this.msg='';
    this.scroll_to_new();
  }

  handleKeyDown(e){
    if(e.keyCode === 13 && !this.no_submit){
      if(this.msg != ""){
        this.msg_send();
        this.msg='';
      }
      this.no_submit=true;
    }
  }
  handleKeyUp(e){
    this.no_submit=false;
    this.scroll_to_new();
  }

  parse_new (a:string){
    console.log(a);
    var request = JSON.parse(a);
    switch(request["type"]){
      case "regi_ack":
        this.append_terminal_gr("服务器已连接！");
      break;
      case "msg":
        this.append_terminal_gr("服务器已连接！");
      break;
      case "hello":
        this.append_terminal_gr("服务器已连接！");
      break;
      default:
        console.log('unknown type message received');
      break;
    }
  }

  public enc (inp:string){
    if(this.module==null){
      return "unable to encrypt!"
    }
    return this.module.loader_check(this.a,inp);
  }
  public dec (inp:string){
    if(this.module==null){
      return "unable to decrypt!"
    }
    return this.module.loader_out(this.a,inp);
  }
  public msg_hash(inp:string){
    if(this.module==null){
      return "unable to get hash of \""+inp+"\"!"
    }
    return this.module.get_hash(inp);
  }

  /**
   * Feature first written in 5/1/2022 by Yi Yang
   *
   * Loads the chat history of the current session (a page refresh is a different session).
   * Meant to be used to have the look and feel of a multi-page application,
   * but in fact when users go to different feature (e.x. go from chat to notes and back to chat)
   * the app needs to reload everything from chatService.
   *
   * Could have problem when the chat history is very large, which suggests loading only
   * the latest few chats first and reload more when needed.
  */
  private load_hist(){
    var chat_hist:NamedServerMsgA[] = this.chatservice.get_saved_msg();
    for (let i = 0; i < chat_hist.length; i++) {
      this.append_terminal_wh("encrypted data: \n"+JSON.stringify(chat_hist[i]));
      this.append_terminal_gr("decrypted: \n"+this.dec(chat_hist[i].msg));
    }
  }
  private msg_send(){
    /**
     * Only save or send encrypted data
    */
    var b =this.enc(this.msg); // encryption
    const mp : NamedServerMsgA = {
      msg: b,
      msgh: this.msg_hash(this.msg),
      type: "msg",
      time: (new Date().getTime().toString()),
      sender: "testing user",
      receiver: "testing recv",
      val: "TESTING ONLY, USERNAME NOT ENCRYPTED!",
    };
    this.chatservice.save_msg(mp);
    this.append_terminal_wh("encrypted data: \n"+JSON.stringify(mp));
    this.append_terminal_gr("decrypted: \n"+this.dec(b));
  }

  public scroll_to_new() {
    var objDiv = document.getElementById("output");
    // if(objDiv!=null){
    console.log(objDiv.scrollHeight);
    objDiv.scrollTop = objDiv.scrollHeight +(objDiv.scrollHeight);
    // }
  }
  public append_terminal_wh (a:String) {
    a=this.sr.sanitize(SecurityContext.HTML,a);
    this._term +=
      "<font color=\"white\">"
      +a
      +"</font></br>";
  }
  public append_terminal_rd (a:String) {
    a=this.sr.sanitize(SecurityContext.HTML,a);
    this._term +=
      "<font color=\"red\">"
      +a
      +"</font></br>";
  }
  public append_terminal_gr (a:string) {
    a=this.sr.sanitize(SecurityContext.HTML,a);
    this._term +=
      "<font color=\"green\">"
      +a
      +"</font></br>";
  }



}
