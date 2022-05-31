import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogData } from 'src/app/_types/Compos';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-dialogNotifications',
  templateUrl: './dialogNotifications.component.html',
  styleUrls: ['./dialogNotifications.component.scss']
})
export class DialogNotificationsComponent implements OnInit {

  constructor(
     @Inject(MAT_DIALOG_DATA) public data:  dialogData,
     private dialogRef: MatDialogRef<DialogNotificationsComponent>,
     ) {

     }

  ngOnInit() {
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
