import { Injectable } from '@angular/core';
import{User} from '../_types/User'
import {ServerMsg, } from '../_types/ServerMsg';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
// import { EncryptComponent } from '../security/encrypt/encrypt.component';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  private signin_status_obj:ServerMsg=new ServerMsg;
  private signin_status_value: BehaviorSubject<ServerMsg>;
  public signin_status: Observable<ServerMsg>;

  public feature_route:BehaviorSubject<string>;
  public feature: Observable<string>;
  private pswd:string="";
  public b:string = "1234"; // development password

  constructor(
  ) {
    // Sign In status init
    this.signin_status_obj.receiver='';
    this.signin_status_obj.v1='';
    this.signin_status_obj.v2='';
    this.signin_status_obj.v3='';
    this.signin_status_obj.v4='';
    this.signin_status_value = new BehaviorSubject<ServerMsg>(this.signin_status_obj);
    this.signin_status = this.signin_status_value.asObservable();

    // Nav status init
    this.feature_route = new BehaviorSubject<string>("chat");
    this.feature = this.feature_route.asObservable();
  }



  public set_signin_status(a:ServerMsg){
    this.signin_status_value.next(a);
    // console.log(a.toString());
  }

  public set_pswd(a:string){
    this.pswd = a;
    // console.log("making password: "+ this.pswd);
  }

  public pw(){
    return this.pswd;
  }

  public get signinValue(): ServerMsg {
    return this.signin_status_value.value;
  }


}
