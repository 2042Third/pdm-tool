import { Component, OnInit } from '@angular/core';
import { c20 } from '../emscripten/c20wasm';
import { EmscriptenWasmComponent } from '../emscripten/emscripten-wasm.component';
import { UserinfoService } from '../../_services/userinfos.service';
import { Encry } from 'src/app/_types/User';

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.scss']
})
export class EncryptionComponent extends EmscriptenWasmComponent<c20> implements OnInit{
  authdata: any;
  authdata_make: string = "";

  constructor(
    private userinfo: UserinfoService,
  ) {
    super("Cc20Module", "notes.js");
    console.log("WARNING, IF THIS MESSAGE IS SHOWING MORE THAN ONCE, PLEASE CLOSE THGE PROGRAM!!!");
    // Authenticated messages
    this.authdata = this.userinfo.authdata_stream.subscribe(
      data=>{
        if(data!=null){
          this.authdata_make = data.val.toString();
          console.log("ENCRYPTION COMPONENT authdata: "+ this.authdata_make);
        }
      }
    );
  }

  ngOnInit(): void {

  }

  public check_module (){
    if(this.module==null ){
      console.log("No module loaded!");
    }else{
      console.log("Module success!");
    }
  }


  enc2(p:string,a: string){
    if(a.length==0){
      return '';
    }
    console.log("DELETE THIS MESSAGE ENC2 "+p+"    "+a);
    return this.module.loader_check(p,a);
  }

  dec2(p:string,a:string){
    if(a.length==0){
      return '';
    }
    console.log("DELETE THIS MESSAGE DEC2 "+p+"    "+a);
    return this.module.loader_out(p,a);
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
  public pass_is_set(){
    return this.authdata_make!="";
  }

  ngOnDestroy(){
    this.authdata.unsubscribe();
  }
}
