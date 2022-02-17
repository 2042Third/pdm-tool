import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
export const WS_ENDPOINT = environment.WB_SOCKS;

@Injectable({
  providedIn: 'root'
})
export class WebsockService {
  socket: WebSocket;
  connected:boolean=false;

  public connect(): void {
    this.connectas(WS_ENDPOINT);
    this.connected=false;
  }

  public connectas(host:string | URL){
    if ('WebSocket' in window) {
        this.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
      this.socket = new WebSocket(host);
  } else {
        console.log('不支持此浏览器，请使用 Firefox, Chrom, Safari.');
        return;
    }

    this.socket.onopen = function () {
        console.log('服务器接口打开inject。');
        // send_regi();
    };

    this.socket.onclose = function () {
        console.log('服务器接口关闭。');
    };

}

public send (a:string) {
  if (a != '') {
      this.socket.send(a);
  }
}


}
