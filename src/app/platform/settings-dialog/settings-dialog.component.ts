import { Component, OnInit } from '@angular/core';
import {UserinfoService} from "../../_services/userinfos.service";

@Component({
  selector: 'settingsDialogComponent',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  panelOpenState = false;

  constructor(
    public userinfo: UserinfoService
  ) {

  }

  ngOnInit() {}

}
