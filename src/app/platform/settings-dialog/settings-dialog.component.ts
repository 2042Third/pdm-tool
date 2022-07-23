import { Component, OnInit } from '@angular/core';
import {UserinfoService} from "../../_services/userinfos.service";
import {Platform} from "@ionic/angular";
import {StorageService} from "../../_services/storage.service";

@Component({
  selector: 'settingsDialogComponent',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  GeneralPanelOpenState = false;
  SecurityPanelOpenState = false;
  // General
  // Security
  security_list_timeout = [
    {timeout:5, name:"5"},
    {timeout:20, name:"20"},
    {timeout:60, name:"60"},
    {timeout:720, name:"720"},
  ];
  timeout_value: number;
  app_pw_toggle: boolean = true;
  selectedTabName: any = 'none';
  colorstyle: string;
  platform_info: string = '';

  constructor(
    public userinfo: UserinfoService,
    public platform: Platform,
    public storage: StorageService,
  ) {
    this.timeout_value = userinfo.cookies_timeout;
    console.log(this.platform.platforms());
    for (let i in this.platform.platforms()){
      this.platform_info = this.platform_info+" "+this.platform.platforms()[i];
    }
  }


  security_change_save_timeout(e): void{
    let name = e.target.value;
    let list = this.security_list_timeout.filter(x => x.name === name)[0];
    console.log(`Change app pw timeout to = ${this.timeout_value}`);
    if (this.timeout_value == 0){
      this.timeout_value = 20;
    }
    this.userinfo.cookies_timeout = this.timeout_value;
  }
  clear_timeouts(){
    this.timeout_value = 0;
  }

  ngOnInit() {}

  security_toggle_app_pw(e) {
    console.log(`Change app pw toggle to = ${this.app_pw_toggle}`);

  }

  selected_setting(tab) {
    console.log(`Change color `);
    this.selectedTabName = tab;
    this.colorstyle=this.GeneralPanelOpenState ? 'dark gray' : 'white';
  }

}
