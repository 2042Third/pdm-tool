import {Injectable, NgZone, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {UserinfoService} from "./userinfos.service";
import {EncryptionComponent} from "../security/encryption/encryption.component";
import {BehaviorSubject, from, Subject} from "rxjs";
import {LiveobjService} from "./liveobj.service";
import {Platform} from "@ionic/angular";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {Encry} from "../_types/User";
import {NgxIndexedDBService} from "ngx-indexed-db";
import {DialogsService} from "./dialogs.service";

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnInit{
  stream_sub: any;
  private em: EncryptionComponent;
  private cookies_timeout: number = 20;
  public storage_engine: string;

  constructor(
    private ngzone: NgZone,
    private cookieService: CookieService,
    private lobj : LiveobjService,
    private platform: Platform,
    private dbService: NgxIndexedDBService,
    private dialogs: DialogsService,
  ) {
    this.stream_sub = this.lobj.enc_stream_return.subscribe(
      data => {
        if(data!=null){
          this.ngzone.run(()=> {
            this.em = data;
            console.log("Storage gets encrypt");
          });
        }
      }
    );

    if(this.platform.is('desktop') || this.platform.is('mobileweb')){
      this.storage_engine = "desktop/mobile browser";
    }
    else if ((this.platform.is('ios') || this.platform.is('android'))){
      this.storage_engine = "mobile";
    }
  }

  ngOnInit(): void {

  }
  /**
   * Return the cookies of the given email
   * @param a email
   */
  get_cookies(a:string){
    return this.em.dec2(a+"pdm",this.cookieService.get(a));
  }

  /**
   * Gets the local storage (application password).
   * @param a email (cookies encoded)
   * */
  get_app_store(a:string){
    if(this.platform.is('desktop') || this.platform.is('mobileweb')){
      console.log("desktop/browser get "+ a);
      return this.get_cookies(a);
    }
    else if ((this.platform.is('ios') || this.platform.is('android'))){
      console.log("ios/android get "+ a);
      this.dbService.getAllByIndex('phoneStore', "email",IDBKeyRange.only(a))
        .subscribe({
          next: (kpis)=>
          {
            console.log("get_app_store mobile local => "+JSON.stringify(kpis[0]));
            return JSON.parse(JSON.stringify(kpis[0]));
          },
          error: data=>{
            console.log('idexed db error');
          }
        });
    }
  }
  /**
   * Sets a 20 minutes timeout cookie that stores the application password.
   *
   * */
  set_app_store(email:string, pass:string){
    if(this.platform.is('desktop') || this.platform.is('mobileweb')){
      console.log("desktop/browser set phone store");
      this.set_cookies(email,pass);
    }
    else if ((this.platform.is('ios') || this.platform.is('android'))){
      console.log("ios/android set phone store");
      this.set_phone_store(email,pass);
    }
  }

  set_phone_store(email:string, pass:string){
    let phone_store =  {
      email: email,
      secure: pass
    };
    this.clear_phone_store(email).subscribe({
        next:(_)=>{
          this.dbService.add('phoneStore',phone_store).subscribe({
              next:(key) => {
                console.log('phoneStore key: ', key);
              }, //next
              error: data => {
                console.log("Local Storage error "+ data.message);
                this.dialogs.openDialog('Local Storage Error:  \n'+data.message);
              } // error
            }); // subscribe
        }, // clear.next
        error: data => {
          console.log("Clear Local Storage error "+ data.message);
          this.dialogs.openDialog('Clear Local Storage Error:  \n'+data.message);
        } // clear.error
      });// subscribe
  }

  /**
   * Deletes all local stores of phone store
   * @param a email
   */
  clear_phone_store(a:string = null){
    let local_all;
    return this.dbService.getAll('phoneStore')
      .pipe((kpis) => {
        local_all = JSON.parse(JSON.stringify(kpis));
        console.log(local_all);
        if(local_all==null || local_all.length==0){
          return;
        }
        for (let i=0; i< local_all.length; i++){
          if(a!= null && a==local_all[i].email){
            console.log("Delete/update currennt local phoneStore");
            this.delete_from_db("phoneStore",local_all[i].id);
          }
          else if (a == null){
            this.delete_from_db("phoneStore",local_all[i].id);
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
  delete_from_db(a:string , b:string) {
    this.dbService.delete(a, b).subscribe((data) => {
      console.log('deleted:', data);
    });
  }
  /**
   * Sets cookies
   * */
  set_cookies(email:string, pass:string){
    let dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + this.cookies_timeout);
    console.log("Setting coookies on \""
    +this.platform.is('ios')? 'ios':"not ios"
      +"\". Expiring on "+dateNow.toDateString()+" "+dateNow.getHours()+":"+dateNow.getMinutes());
    if(!environment.production)
      this.cookieService.set(email, pass, dateNow,'/','localhost',true,'Strict');
    else
      this.cookieService.set(email,  pass, dateNow,'/','pdm.pw',true,'Strict');
  }

  ngOnDestroy() {
    this.stream_sub.unsubscribe();
  }
}
