import { Injectable, NgZone, OnInit } from '@angular/core';
import{Encry, User} from '../_types/User'
import {pdmSecurityStore, ServerMsg,} from '../_types/ServerMsg';
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
import { NotesService } from './notes.service';
import { AuthService } from './auth.service';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class UserinfoService implements OnInit {
  private signin_status_obj:ServerMsg=new ServerMsg;
  public signin_status_value:Subject<ServerMsg> =new BehaviorSubject<ServerMsg>(this.signin_status_obj);
  public authdata_stream:Subject<Encry> = new BehaviorSubject<Encry>(null);
  public authdata_stream_app:Subject<Encry> = new BehaviorSubject<Encry>(null);
  public enc_stream_return:Subject<EncryptionComponent> = new BehaviorSubject<EncryptionComponent>(null);// encryption return
  public debug_mock:Subject<Boolean> = new BehaviorSubject<Boolean>(false);
  public feature: Observable<string>;
  private pswd:string="";
  public b:string = "1234"; // development password
  private debug_usr = '{"receiver":"b8e58cc943387c15f2a5b3c04619e560041b884deee6613036a92cb9d22e2d7b6b19a23705","sender":"server","time":"1654652363467","type":"SignIn","email":"18604713262@163.com","status":"success"}';
  mocking_status: boolean =false;
  stream_sub: any;

  encryption_module: EncryptionComponent;
  dialogRef: MatDialogRef<DialogNotificationsComponent, any>;
  authdata_stream_app_ref: Subscription;
  authdata_stream_ref: Subscription;
  waiting_for_app: boolean =false;
  app_local:string = null;
  enc_info:ServerMsg=new ServerMsg();
  public local_not_set: ServerMsg;
  usersubject_ref: Subscription;
  crypt_version;
  pdm_version:string = '0.1';
  public cookies_timeout = 20; // timeout length
  constructor(
    private ngzone: NgZone,
    private dbService: NgxIndexedDBService,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private auth_serv:AuthService,
    private platform : Platform,
  ) {



    this.stream_sub = this.enc_stream_return.subscribe(
      data => {
        if(data!=null){
          this.ngzone.run(()=>{
            this.encryption_module = data;
            this.crypt_version = this.encryption_module.pdmSecurityVersion;
            this.get_all_db();
          });
        }
      }
    );
    this.usersubject_ref = this.auth_serv.userSubject.subscribe( // only happen in
      data=>{ // set local_not_set
        if(data!=null){
          this.openDialogEnter(); // set app pass
          this.local_not_set = JSON.parse(JSON.stringify(data));
        }
      }
    );

    this.authdata_stream_app_ref = this.authdata_stream_app.subscribe(data=>{
      if(data!=null){
        console.log("app set => "+ JSON.stringify(data));
        this.app_local = data.val.toString();
        this.cookies_setting(this.app_local, this.local_not_set.email.toString());
        // pass set, push user info or set signin status
        if(this.local_not_set!=null){
          this.first_setup(this.local_not_set);
        }else {}
        if(data.type == "user_enter"){
          this.ponce_process(this.local_not_set.email.toString(), this.pswd); // moved from signin comp
        }
      }
    });
    this.authdata_stream_ref = this.authdata_stream.subscribe(
      data=>{
        if(data!=null && data.val == null && data.type == "set_pass"){
          this.sign_out();
          setTimeout(()=>{window.location.reload();},500); // refresh page after signout
        }
      }
    );
  }
  ngOnInit(): void {
    console.log("userinfo init");
    // throw new Error('Method not implemented.');
  }
  afterViewInit(){
    console.log("userinfo init");

  }

  first_setup(data){
    // set data to indexeddb
    this.dbService.add('pdmTable', data)
    .subscribe((key) => {
      this.b = JSON.stringify(key);
    });
    // Set data to usrinfo
    this.set_signin_status( data);
  }

  /**
   * Sets a 20 minutes timeout cookie that stores the application password.
   * @param pass pass
   * @param email email
   *
  */
  cookies_setting(pass:string, email:string){
    let dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + this.cookies_timeout);
    if( pass!= null && pass != ""){
      console.log("Setting coookies on \""
      +this.platform.is('ios')? 'ios':"not ios"
      +"\". Expiring on "+dateNow.toDateString()+" "+dateNow.getHours()+":"+dateNow.getMinutes());
      if(!environment.production)
        this.cookieService.set(this.cookies_encode(email), this.enc2(this.cookies_encode(email)+"pdm",pass), dateNow,'/','localhost',true,'Strict');
      else
        this.cookieService.set(this.cookies_encode(email),  this.enc2(this.cookies_encode(email)+"pdm",pass), dateNow,'/','pdm.pw',true,'Strict');
    } else {
      console.log("No updates to cookies can be made.");
    }
  }

  /**
   * Return the cookies of the given email
   * @param a email
   */
  get_cookies(a:string){
    return this.dec2(a+"pdm",this.cookieService.get(a));
  }

  /**
   * Encodes strings to URL-encoding for cookies storage.
   * Currently used for emails
   * @param a email
  */
  cookies_encode(a:string){
    return a.replace("@", "_");
  }

  /**
   * Sets the signin detail packet.
   *
  */
  public set_signin_status(a:ServerMsg){
    this.signin_status_obj = JSON.parse(JSON.stringify(a));
    this.signin_status_obj.username = this.dec(this.signin_status_obj.receiver.toString());
    this.signin_status_value.next(this.signin_status_obj);
  }

  public pass_is_set(){
    if(this.encryption_module == null ){
      return false;
    }
    return this.encryption_module.pass_is_set();
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

  mock_ps(){
      this.mocking_status = true;
      this.debug_mock.next(this.mocking_status);
      let tmp = new Encry();
      tmp.val = "1234";
      tmp.type = "debug";
      tmp.data = "none";
      this.authdata_stream.next(tmp);
      this.pswd = '1234';
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
    let stored_app = null;
    this.dbService.getAll('pdmTable')
    .subscribe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      if(local_all==null || local_all.length == 0){
        console.log("No local user");
        return;
      }
      else { // target the pass with the user's email
        stored_app = this.get_cookies(this.cookies_encode(local_all[0].email)); // app pass
      }
      for(let i=0; i< 1;i ++){ // HARDCODED TO ONLY TAKE THE FIRST RESULT
        this.local_not_set = JSON.parse(JSON.stringify(local_all[i]));
        this.dbService.getAllByIndex('pdmSecurity', "email",IDBKeyRange.only(local_all[i].email))
        .subscribe({
          next: (kpis)=>
        {
          let local_all1 = JSON.parse(JSON.stringify(kpis[0]));
          this.enc_info.email = local_all[i].email;
          this.enc_info.val = local_all1.secure;
          this.waiting_for_app = true;
          if (stored_app == null || stored_app == "") {// app pass ask, when there is local
            this.openDialogReenter(local_all1.email, local_all1.secure, local_all1.checker);
          } else {  // Complicate stuff ended up being solved best with simple answers
            let tmp = new Encry();
            tmp.type = "local_signin";
            tmp.data = (JSON.stringify(kpis[0]));
            tmp.val = this.dec2(stored_app, JSON.parse(tmp.data).secure.toString());
            console.log(JSON.stringify(tmp));
            this.authdata_stream.next(tmp);
            let authdata_stream_app_obj = new Encry();
            authdata_stream_app_obj.val = stored_app;
            authdata_stream_app_obj.type = "local_read";
            this.authdata_stream_app.next(authdata_stream_app_obj);
            this.ponce_process(this.local_not_set.email.toString(), this.pswd); // moved from signin comp
          }
        },
        error: data=>{
          console.log('idexed db error');
          this.openDialog("Indexed DB error. Unable to store user data.");
        }
      });
      }

    });
  }

  openDialog(a:string = ''){
    if (a != ''){ // custom alert message
      let dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {dialogType: "Alert", dialogTitle: "Alert", message: a};
      dialogConfig.panelClass = 'custom-modalbox';
      this.dialogRef = this.dialog.open(DialogNotificationsComponent, dialogConfig);
    }
    else
    { // default to giving an alert to sign in
      let dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {dialogType: "Alert", dialogTitle: "Alert", message: "Please log in."};
      dialogConfig.panelClass = 'custom-modalbox';
      this.dialogRef = this.dialog.open(DialogNotificationsComponent, dialogConfig);
    }
  }

  openDialogEnter(){
    let enterDialog: MatDialogConfig= new MatDialogConfig();
    enterDialog.autoFocus = true;
    enterDialog.data = {dialogType:"Enter",dialogTitle:"Application Password", message:"Set an application password for this computer."};
    enterDialog.panelClass= 'custom-modalbox';
    this.dialogRef = this.dialog.open(DialogNotificationsComponent, enterDialog);
  }
  /**
   * Askes user to enter the application password again.
   * @param a email
   * @param b pass
   * @param c checker
   *
  */
  openDialogReenter(a:string,b:String=null, c:String=null){
    let enterDialog: MatDialogConfig= new MatDialogConfig();
    enterDialog.autoFocus = true;
    enterDialog.data = {
      dialogType:"Reenter"
      ,dialogTitle:"Application Password"
      ,message:"Local storage found encrypted account for user \""
        +a+"\". \nIf this is your account, please the application password for this user."
      , encInput:b
      , email: a
      , checker:c
      };
    enterDialog.panelClass= 'custom-modalbox';

    this.dialogRef = this.dialog.open(DialogNotificationsComponent, enterDialog);
  }

  public set_pswd(a:string){
    let tmp = new Encry();
    tmp.type = "set_pass";
    tmp.data = "none";
    tmp.val = a;
    this.authdata_stream.next(tmp);
    this.pswd = a;
  }

  public pw(){
    return this.pswd;
  }


  sign_out(){
    this.clear_ponce();
    this.clear_same_email();
  }


  /**
   * set secure storage
   * @param a email
   * @param b password
   *
  */
  ponce_process (a:string, b:string){
    console.log('making ponce new');
    let app_local = this.get_cookies(this.cookies_encode(a));
    if(app_local == null){
      // console.log("No application password set, cannot store password.");
      return;
    }
    // console.log("Using application password, "+app_local+" to "+b);
    this.clear_same_email_secure(a).subscribe((_)=>{
      this.dbService.add('pdmSecurity', {
        email: a,
        ponce_status: false,
        secure:this.enc2(app_local,b),
        checker:this.enc2(app_local,a),
      })
      .subscribe((key) => {
        console.log('indexeddb key: ', key);
      });
    });
  }

  /**
   * Deletes all locale stores of ponce
   *
  */
  clear_ponce(){
    console.log('clearing ponce ');
    let local_all;
    this.dbService.getAll('pdmSecurity')
    .subscribe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      if(local_all==null){
        return;
      }
      for (let i=0; i<local_all.length;i++){
        let itm = (local_all[i]);
        this.delete_from_db("pdmSecurity",itm.id);
      }
    });
  }

  /**
   * Deletes all local stores of account details
   * @param a email
  */
  clear_same_email(a:string = null){
    let local_all;
    this.dbService.getAll('pdmTable')
    .subscribe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      console.log(local_all);
      if(local_all==null || local_all.length==0){
        return;
      }
      for (let i=0; i< local_all.length; i++){
          this.delete_from_db("pdmTable",local_all[i].id);
      }
    });
  }

  /**
   * Deletes all local stores of account details
   * @param a email
  */
  clear_same_email_secure(a:string = null){
    let local_all;
    return this.dbService.getAll('pdmSecurity')
    .pipe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      console.log(local_all);
      if(local_all==null || local_all.length==0){
        return;
      }
      for (let i=0; i< local_all.length; i++){
        if(a!= null && a==local_all[i].email){
          console.log("Delete/update currennt local store");
          this.delete_from_db("pdmSecurity",local_all[i].id);
        }
        else if (a == null){
          this.delete_from_db("pdmSecurity",local_all[i].id);
        }
      }
      return kpis;
    });
  }

/**
 * Delete from the local db
 * @param a table name
 * @param b item id
*/
delete_from_db(a:string , b:string){
  this.dbService.delete(a, b).subscribe((data) => {
    console.log('deleted:', data);
  });
}

  set_mock_db(){// DEBUG ONLY
    this.dbService.add('pdmTable', {
      username: "some usr",
      view: "signin",
      email: "18604713262@163.com"
    })
    .subscribe((key) => {
      console.log('DEBUG indexeddb key: ', key);
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
  ngOnDestroy() {
    this.stream_sub.unsubscribe();
    this.usersubject_ref.unsubscribe();
    this.authdata_stream_app_ref.unsubscribe();
    this.authdata_stream_ref.unsubscribe();
  }

}
