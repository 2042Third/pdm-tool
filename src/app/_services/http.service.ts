import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HTTP} from "@awesome-cordova-plugins/http/ngx";
import {HttpClient} from "@angular/common/http";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  devicePlat: string;
  constructor(
    private http2: HTTP, // mobile
    private http: HttpClient, // desktop, browser
    private platform: Platform,
  ) {
    // http request setup
    this.http2.setDataSerializer('json');
    // get device platform
    console.log(this.platform.platforms());
  }
  post<K>(url:string, arg1:any, arg2:any=null){
    if(this.platform.is('desktop') || this.platform.is('mobileweb')){
      console.log("http desktop/browser call");
      return this.http.post<K>(url, arg1).pipe(map(data => {
        return data;
      }));
    }
    else if ((this.platform.is('ios') || this.platform.is('android'))){
      console.log("http ios/android call");
      return from(this.http2.post(url, structuredClone(arg1),arg2)).pipe(map(data => {
        return data.data;
      }));
    }
  }
}
