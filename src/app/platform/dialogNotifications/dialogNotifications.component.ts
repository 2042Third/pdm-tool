import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogData } from 'src/app/_types/Compos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserinfoService } from '../../_services/userinfos.service';
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
  }
  closeDialog(){
    this.dialogRef.close();
  }
  doneDialog(){
    this.userinfo.authdata_stream_app.next(this.dialogInput);
  }
}
