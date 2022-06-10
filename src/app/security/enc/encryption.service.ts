import { Injectable } from '@angular/core';
import { c20 } from '../emscripten/c20wasm';
import { EmscriptenWasmComponent } from '../emscripten/emscripten-wasm.component';

@Injectable({
  providedIn: 'any'
})
export class EncryptionService extends EmscriptenWasmComponent<c20>   {
  a="1234";
  constructor() {
    super("Cc20Module", "notes.js");
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
}
