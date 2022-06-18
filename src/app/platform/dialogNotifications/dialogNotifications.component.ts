import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogData } from 'src/app/_types/Compos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    this.userinfo.authdata_stream_app.next(authdata_stream_app_obj);
    if(this.data.dialogType=='Reenter' && this.data.encInput != null){
      let tmp = new Encry();
      tmp.type = "set_pass";
      tmp.data = "none";
      tmp.val = this.userinfo.dec2(this.dialogInput.toString(),this.data.encInput.toString());
      this.userinfo.authdata_stream.next(tmp);
    }
    this.closeDialog();
  }
}
