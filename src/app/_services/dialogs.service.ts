import { Injectable } from '@angular/core';
import {DialogNotificationsComponent} from "../platform/dialogNotifications/dialogNotifications.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  dialogRef: MatDialogRef<DialogNotificationsComponent, any>;
  constructor(
    public dialog: MatDialog,
    ) {

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
}
