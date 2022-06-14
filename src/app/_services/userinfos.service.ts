import { Injectable, NgZone, OnInit } from '@angular/core';
import{Encry, User} from '../_types/User'
import {ServerMsg, } from '../_types/ServerMsg';
import { lastValueFrom, Observable, Subject, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogNotificationsComponent } from '../platform/dialogNotifications/dialogNotifications.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { take } from 'rxjs/operators';
// import { EncryptComponent } from '../security/encrypt/encrypt.component';
import { EncryptionComponent } from '../security/encryption/encryption.component';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService implements OnInit {
  private signin_status_obj:ServerMsg=new ServerMsg;
  // subject :Subject<ServerMsg> =new Subject<ServerMsg>();
  private s_authdata="";
  public signin_status_value:Subject<ServerMsg> =new BehaviorSubject<ServerMsg>(this.signin_status_obj);
  // public signin_status_value_note:Subject<ServerMsg> =new BehaviorSubject<ServerMsg>();
  public authdata_stream:Subject<String> = new BehaviorSubject<String>(this.s_authdata);
  public authdata_stream_app:Subject<String> = new BehaviorSubject<String>(this.s_authdata);
  public enc_stream_return:Subject<EncryptionComponent> = new BehaviorSubject<EncryptionComponent>(null);// encryption return
  public debug_mock:Subject<Boolean> = new BehaviorSubject<Boolean>(false);
  public signin_status: Observable<ServerMsg>;
  public signin_status_note: Observable<ServerMsg>;

  public feature_route:BehaviorSubject<string>;
  public feature: Observable<string>;
  private pswd:string="";
  public b:string = "1234"; // development password
  private debug_usr = '{"receiver":"182972a438ba54a763aab5e013497c05b00e29cb87bc726f7523608f81d01c0b80168ee889","sender":"server","time":"1654652363467","type":"SignIn","email":"18604713262@163.com","status":"success"}';
  mocking_status: boolean =false;
  stream_sub: any;
  encryption_module: EncryptionComponent;
  dialogRef: MatDialogRef<DialogNotificationsComponent, any>;
  authdata_stream_app_ref: Subscription;
  constructor(
    private ngzone: NgZone,
    private dbService: NgxIndexedDBService,
    public dialog: MatDialog,
    private cookieService: CookieService
  ) {
    this.get_all_db();
    this.stream_sub = this.enc_stream_return.subscribe(
      data => {
        if(data!=null){
          this.ngzone.run(()=>{
            this.encryption_module = data;
          });
        }
      }
    );

  }
  ngOnInit(){
    this.authdata_stream_app_ref = this.authdata_stream_app.subscribe(data=>{
      this.coockies_setting(data.toString());
    });
  }

  coockies_setting(a:string){
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + 20);

    this.cookieService.set('application', a, dateNow,'/','pdm.pw',true,'Strict');
  }
  public set_signin_status(a:ServerMsg){
      this.signin_status_obj = JSON.parse(JSON.stringify(a));
      this.signin_status_obj.username = this.signin_status_obj.receiver;
      this.signin_status_value.next(this.signin_status_obj);
  }

  public is_signed_in(){
    return this.signin_status_obj.status == "success";
  }

  public get_info(){
    return this.signin_status_value;
  }

  public set_encryption(a:EncryptionComponent){
    this.ngzone.run(()=>{
      this.enc_stream_return.next(a);
    });

  }

  enc(a: string){
    if(this.encryption_module !=null)
    {
      return this.encryption_module.enc(a);
    }
    else{
      return null;
    }
  }

  dec(a:string){
    if(this.encryption_module !=null)
    {
      return this.encryption_module.dec(a);
    }
    else{
      return null;
    }
  }
  enc2(p:string,a: string){
    if(this.encryption_module !=null)
    {
      return this.encryption_module.enc2(p,a);
    }
    else{
      return null;
    }
  }

  dec2(p:string,a:string){
    if(this.encryption_module !=null)
    {
      return this.encryption_module.dec2(p,a);
    }
    else{
      return null;
    }
  }

  hash(a:string){
    if(this.encryption_module !=null)
    {
      return this.encryption_module.msg_hash(a);
    }
    else{
      return null;
    }
  }

  mock_ps(){
    if(!environment.production){
      this.mocking_status = true;
      this.debug_mock.next(this.mocking_status);
      this.authdata_stream.next("1234");
      this.pswd = '1234';
    }
  }

  mock_usr(){
    if(!environment.production){
      this.mocking_status = true;
      this.debug_mock.next(this.mocking_status);
      this.signin_status_obj = JSON.parse(this.debug_usr);
      this.signin_status_obj.username = this.signin_status_obj.receiver;
      this.signin_status_value.next(this.signin_status_obj);
    }
  }

  get_all_db(){
    let local_all;
    this.dbService.getAll('pdmTable')
    .subscribe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      console.log("reading local:"+JSON.stringify(local_all));
      if(local_all==null){
        console.log("No local user");
        return;
      }
      for(let i=0; i< local_all.length;i ++){
        console.log("Found local user, resuming session: "+ JSON.stringify(local_all[i]));
        this.set_signin_status(local_all[i]);
        this.dbService.getAllByIndex('pdmSecurity', "email",IDBKeyRange.only(local_all[i].email))
        .subscribe((kpis) => {
          let local_all1 = JSON.parse(JSON.stringify(kpis[0]));
          this.set_pswd(local_all1.secure);
          console.log("pass set for: "+local_all1.email);
        });
      }
    });

  }
  openDialogEnter(){
    let enterDialog: MatDialogConfig= new MatDialogConfig();
    enterDialog.autoFocus = true;
    enterDialog.data = {dialogType:"Enter",dialogTitle:"Application Password", message:"Set an application password for this computer."};
    enterDialog.panelClass= 'custom-modalbox';
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, enterDialog);
  }

  public set_pswd(a:string){
    this.authdata_stream.next(a);
    this.pswd = a;
  }

  public pw(){
    return this.pswd;
  }

  ngOnDestroy() {
    this.stream_sub.unsubscribe();
    this.authdata_stream_app_ref.unsubscribe();
  }

}
