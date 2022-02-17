import { Component } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";
import { WebsockService } from "src/app/websock/websock.service";
import { catchError, map, Observable, tap } from "rxjs";

interface MyEmscriptenModule extends EmscriptenModule {
  loader_check(a:string,inp: string): string;
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

  msg='';
  term='';
  constructor(
    private sock: WebsockService,

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
            var objDiv = document.getElementById("output");
            objDiv.scrollTop = objDiv.scrollHeight;
          break;
          default:
            console.log('unknown type message received');
          break;
        }
      };
    }
  }
  encry(inp: string):string {
    return this.module.loader_check(this.a,inp);
  }

  ngOnInit() {
  }
  handleSubmit(e){
    this.msg_send();
    this.msg='';
  }

  handleKeyUp(e){
    if(e.keyCode === 13){
      this.msg_send();
      this.msg='';
    }
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


  private msg_send(){

    const mp : none_init_msg = {
        msg: this.msg,
        u1:  "user1" ,
        u2:  "user2" ,
        a: "1234"
      };
    this.term+=(this.msg_init(mp));
  }

  private msg_init<String>(msg:none_init_msg ){
    var a = "";
    a = JSON.stringify(
      {
        type:    "msg",
        msg:    this.enc(msg.msg)
      }
    );
    return a;
  }

  public append_terminal_wh (a:String) {
    $("#output").append("<font color=\"white\">"
        +a
        +"</font></br>");
    var objDiv = document.getElementById("output");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  public append_terminal_rd (a:String) {
    $("#output").append("<font color=\"red\">"
        +a
        +"</font></br>");
    var objDiv = document.getElementById("output");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  public append_terminal_gr (a:String) {
    $("#output").append("<font color=\"green\">"
      +a
      +"</font></br>");
    var objDiv = document.getElementById("output");
    objDiv.scrollTop = objDiv.scrollHeight;
  }



}
