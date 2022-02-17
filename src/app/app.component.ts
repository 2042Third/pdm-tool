import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { UserinfoService } from './_services/userinfo.service';
import { WebsockService } from "src/app/websock/websock.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdm-notes';
  constructor(
    private sock: WebsockService,
    private auth: AuthService,
    // private userinfo: UserinfoService,
  ){
  }
}
