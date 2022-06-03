import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { UserinfoService } from './_services/userinfos.service';
import { WebsockService } from './_services/websock.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdm-notes';
  constructor(
    public sock: WebsockService,
    public auth: AuthService,
    public userinfo: UserinfoService,
  ){
  }
}
