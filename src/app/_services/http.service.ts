import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DialogNotificationsComponent} from "../platform/dialogNotifications/dialogNotifications.component";
import {ServerMsg} from "../_types/ServerMsg";
import {HTTP} from "@awesome-cordova-plugins/http/ngx";
import {HttpClient} from "@angular/common/http";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private http2: HTTP, // mobile
    private http: HttpClient, // desktop, browser
    private platform: Platform,
  ) {
    // http request setup
    this.http2.setDataSerializer('json');
  }
  post<K>(url:string, arg1:any, arg2:any=null){
    if(this.platform.is('ios') || this.platform.is('android')){
      console.log("http ios/android call");
      return from(this.http2.post(url, JSON.stringify(arg1),arg2)).pipe(map(data => {
        return data.data;
      }));
    }
    else{
      console.log("http desktop/browser call");
      return this.http.post<K>(url, arg1).pipe(map(data => {
        return data;
      }));
    }
  }
}
