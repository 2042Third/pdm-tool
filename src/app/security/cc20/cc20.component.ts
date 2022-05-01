import { Component, SecurityContext } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";
import { WebsockService } from "src/app/websock/websock.service";
import { catchError, map, Observable, tap } from "rxjs";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl } from "@angular/forms";
import { DisableControlDirective } from '../disableControl.directive';
interface MyEmscriptenModule extends EmscriptenModule {
  loader_check(a:string,inp: string): string;
  loader_out(a:string,inp: string): string;
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
  constructor(
    private sock: WebsockService,
    private sr: DomSanitizer,

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
  encry(inp: string):string {
    return this.module.loader_check(this.a,inp);
  }

  ngOnInit() {
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
        this.scroll_to_new();
      }
      this.no_submit=true;
    }
  }
  handleKeyUp(e){
    this.no_submit=false;
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


  private msg_send(){

    const mp : none_init_msg = {
        msg: this.msg,
        u1:  "user1" ,
        u2:  "user2" ,
        a: "1234"
      };
    // this._term+=(this.msg_init(mp));
    this.msg_init(mp);
    // this.scroll_to_new();
  }

  private msg_init<String>(msg:none_init_msg ){
    var a = "";
    var b =this.enc(msg.msg);
    a = JSON.stringify(
      {
        type:    "msg",
        msg:    b
      }
    );
    this.append_terminal_wh(b);
    this.append_terminal_gr(this.dec(b));
    return a;
  }

  // public get term() : SafeHtml{

  //   return this.sr.bypassSecurityTrustHtml(this._term);
  // }

  public scroll_to_new() {
    var objDiv = document.getElementById("output");
    objDiv.scrollTop = objDiv.scrollHeight;
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
