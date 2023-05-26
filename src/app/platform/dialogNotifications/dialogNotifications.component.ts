import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { dialogData } from 'src/app/_types/Compos';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UserinfoService } from '../../_services/userinfos.service';
import { Encry } from 'src/app/_types/User';
@Component({
  selector: 'app-dialogNotifications',
  templateUrl: './dialogNotifications.component.html',
  styleUrls: ['./dialogNotifications.component.scss']
})
export class DialogNotificationsComponent implements OnInit {
  public enterMsgSet = "Application password.";
  public enterMsg = "This password is used for encrypting your information on this computer.";
  public dialogInput = "";
  private times_remain = 5;
  private remain_msg1 = "Application password incorrect, ";
  private remain_msg2 = " tries remaining.";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:  dialogData,
    private dialogRef: MatDialogRef<DialogNotificationsComponent>,
    private userinfo: UserinfoService,
  ) {

  }

  ngOnInit() {
    console.log("Open "+ this.data.dialogType);

  }
  closeDialog(){
    this.dialogRef.close();
  }
  doneDialog(){
    let authdata_stream_app_obj = new Encry();
    authdata_stream_app_obj.val = this.dialogInput;
    authdata_stream_app_obj.type = "user_enter";
    if(this.data.dialogType == 'Enter'){
      this.userinfo.authdata_stream_app.next(authdata_stream_app_obj);
    }
    else if(this.data.dialogType=='Reenter' && this.data.encInput != null){
      let tmp = new Encry();
      tmp.type = "set_pass";
      tmp.data = "none";
      tmp.val = this.userinfo.dec2(this.dialogInput.toString(),this.data.encInput.toString());
      let check = this.userinfo.dec2(this.dialogInput.toString(),this.data.checker.toString());
      this.times_remain = this.times_remain -1;
      if(this.data.email != check){
        this.data.message = this.remain_msg1+this.times_remain+this.remain_msg2;
        if(this.times_remain < 1){
          tmp.data = null;
          tmp.val = null;
          this.userinfo.authdata_stream.next(tmp); // too many tries, clear all data and refresh.s
          this.closeDialog();
        }
        return;
      }
      else {
        this.userinfo.authdata_stream.next(tmp);
        this.userinfo.authdata_stream_app.next(authdata_stream_app_obj);
        this.closeDialog();
        return;
      }
    }
    this.closeDialog();
  }
}
