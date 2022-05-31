import { ServerMsg } from 'src/app/_types/ServerMsg';
import { Component, OnInit } from '@angular/core';
import {UserinfoService} from '../../_services/Userinfo.service';
import { Subscription,Observable } from 'rxjs';

@Component({
  selector: 'security-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
  private userstatus_sub:Subscription;
  userstatus:ServerMsg=new ServerMsg;
  usercreation="";
  constructor(
  private userinfo: UserinfoService,
  ) {
    this.userstatus_sub = userinfo.signin_status.subscribe(data=>{
      this.userstatus = data
      this.usercreation=this.convertTimestamp(this.userstatus.time)
    });
  }

  private convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2014-03-24, 3:00 PM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
}

  ngOnInit() {
  }
  ngOnDestroy() {
     this.userstatus_sub.unsubscribe();
   }
}
