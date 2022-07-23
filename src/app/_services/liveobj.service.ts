import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {EncryptionComponent} from "../security/encryption/encryption.component";

@Injectable({
  providedIn: 'root'
})
export class LiveobjService {
  stream_sub: any;
  public enc_stream_return:Subject<EncryptionComponent> = new BehaviorSubject<EncryptionComponent>(null);// encryption return

  constructor(

  ) {

  }

  ngOnDestroy() {
    // this.stream_sub.unsubscribe();
  }
}
