import { Injectable, NgZone } from '@angular/core';
import{User} from '../_types/User'
import {ServerMsg, } from '../_types/ServerMsg';
import { Observable, Subject, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
// import { EncryptComponent } from '../security/encrypt/encrypt.component';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  private signin_status_obj:ServerMsg=new ServerMsg;
  subject :Subject<ServerMsg> =new Subject<ServerMsg>();
  public signin_status_value:Subject<ServerMsg> =new Subject<ServerMsg>();
  public signin_status_value_note:Subject<ServerMsg> =new Subject<ServerMsg>();
  public signin_status: Observable<ServerMsg>;
  public signin_status_note: Observable<ServerMsg>;

  public feature_route:BehaviorSubject<string>;
  public feature: Observable<string>;
  private pswd:string="";
  public b:string = "1234"; // development password
  constructor(
    private ngzone: NgZone,
  ) {
  }
  ngOnInit(){
    // Nav status init
    this.feature_route = new BehaviorSubject<string>("chat");
    this.feature = this.feature_route.asObservable();
  }
  public set_signin_status(a:ServerMsg){
      this.signin_status_obj = JSON.parse(JSON.stringify(a));
      this.signin_status_obj.username = this.signin_status_obj.receiver;
      this.signin_status_value.next(this.signin_status_obj);
      this.signin_status_value_note.next(this.signin_status_obj);
  }

  public is_signed_in(){
    return this.signin_status_obj.status == "success";
  }

  public get_info(){
    return this.signin_status_value;
  }

  public get_info_note(){
    return this.signin_status_value_note;
  }

  public set_pswd(a:string){
    this.pswd = a;
  }

  public pw(){
    return this.pswd;
  }

  ngOnDestroy() {
    // this.feature_sub.unsubscribe();
  }

}
