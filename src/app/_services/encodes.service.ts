import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncodesService {

  constructor() { }
  /**
   * Encodes strings to URL-encoding for cookies storage.
   * Currently used for emails
   * @param a email
   */
  cookies_encode(a:string){
    return a.replace("@", "_");
  }
}
