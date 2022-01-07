import { Component } from '@angular/core';
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
  ){
    this.sock.connect();
  }
}
