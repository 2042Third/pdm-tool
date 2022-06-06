import { Component, SecurityContext } from "@angular/core";
import {MatListModule} from '@angular/material/list';
import { WebsockService } from "src/app/_services/websock.service";
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from "@angular/forms";
// import { NamedServerMsg, NamedServerMsgA } from '../../_types/ServerMsg';
import { ChatService } from 'src/app/_services/chat.service';
// import { EncryptService } from 'src/app/_services/encrypt.service';
import { UserinfoService } from '../../_services/userinfos.service';
// import { EncryptComponent } from '../encrypt/encrypt.component';
import { c20 } from "../emscripten/c20wasm";
import { EmscriptenWasmComponent } from "../emscripten/emscripten-wasm.component";
import { ServerMsg } from "src/app/_types/ServerMsg";
import { formatDate } from "@angular/common";


@Component({
  selector: 'security-cc20',
  templateUrl: './cc20.component.html',
  styleUrls: ['./cc20.component.scss']
})
export class Cc20Component extends EmscriptenWasmComponent<c20>  {
  a:string="1234"; // development password
  no_submit:boolean=false;
  msg='';
  _term='';
  formControl;
  public chat_hist:ServerMsg[];
  has_display=false;
  remake = 0 ; // control
  // private encry: EncryptComponent
  constructor(
    private sock: WebsockService,
    private sr: DomSanitizer,
    public chatservice: ChatService,
    private user:UserinfoService,
  ) {
    super("Cc20Module", "notes.js");
    if(this.sock.connected){
      this.sock.socket.onmessage = function (incoming) {
        var a:string = incoming.data;
        console.log(a);
        var request = JSON.parse(a); // initial network
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
    this.chat_hist = this.chatservice.get_saved_msg();
    for (let i = 0; i < this.chat_hist.length; i++) {
      this.append_terminal_wh("encrypted data: \n"+JSON.stringify(this.chat_hist[i]));
      this.append_terminal_gr("decrypted: \n"+this.dec(this.chat_hist[i].msg));
    }
  }
  private msg_send(){
    /**
     * Only save or send encrypted data
    */
    var b =this.enc(this.msg); // encryption
    const mp : ServerMsg = {
      msg: b,
      msgh: this.msg_hash(this.msg),
      type: "msg",
      time: (new Date().getTime().toString()),
      sender: "testing user",
      receiver: "testing recv",
      email: "none",
      status: "none",
      h: "none",
      val: "TESTING ONLY, USERNAME NOT ENCRYPTED!",
      username: "",
      sess: ""
    };
    this.chatservice.save_msg(mp);
    // this.append_terminal_wh("encrypted data: \n"+JSON.stringify(mp));
    // this.append_terminal_gr("decrypted: \n"+this.dec(b));
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
  public scroll_to_new() {
    var objDiv = document.getElementById("output");
    // if(objDiv!=null){
    // console.log(objDiv.scrollHeight);
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
