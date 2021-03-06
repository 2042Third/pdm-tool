import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { UserinfoService } from './_services/userinfos.service';
import { StorageService } from './_services/storage.service';
import { WebsockService } from './_services/websock.service';
import { EncryptionComponent } from './security/encryption/encryption.component';
import {LiveobjService} from "./_services/liveobj.service";
import { PlatformComponent } from './platform/platform.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'pdm-notes';

  @ViewChild('encryption') mainencrypt: EncryptionComponent;
  constructor(
    public sock: WebsockService,
    public auth: AuthService,
    public userinfo: UserinfoService,
    public storage: StorageService,
    public lobj: LiveobjService,
  ){

    // setTimeout(()=>{userinfo.set_encryption(this.mainencrypt)},1000);
  }
  ngAfterViewInit() {
    if(this.mainencrypt!=null){
      console.log("after init good");
    }
    else{
      console.log("after init bad");
    }
    setTimeout(()=>{
      // if(this.mainencrypt!=null){
        this.lobj.enc_stream_return.next(this.mainencrypt);
      // }
    },1000);
  }
}
