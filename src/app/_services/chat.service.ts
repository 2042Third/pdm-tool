import { Injectable } from '@angular/core';
import { NamedServerMsgA } from '../_types/ServerMsg';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chat_hist:NamedServerMsgA[] = new Array();

  constructor() { }

  public save_msg(a:NamedServerMsgA){
    this.chat_hist.push(a);
  }

  public get_saved_msg(){
    return this.chat_hist;
  }
}
