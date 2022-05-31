import { Injectable } from '@angular/core';
import { ServerMsg } from '../_types/ServerMsg';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chat_hist:ServerMsg[] = new Array();

  constructor() { }

  public save_msg(a:ServerMsg){
    this.chat_hist.push(a);
  }

  public get_saved_msg(){
    return this.chat_hist;
  }
}
