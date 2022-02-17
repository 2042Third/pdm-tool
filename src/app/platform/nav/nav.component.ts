/**
 * By Yang Yi
 *  2/2022
 *
*/
import { Component, OnInit } from '@angular/core';
import {UserinfoService} from '../../_services/Userinfo.service';
import { Subscription,Observable } from 'rxjs';
import {
  faLightbulb as faSolidLightbulb,
  faListAlt,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as faRegularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { ThemeService } from "src/app/theme/theme.service";

import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  faLightbulb!: IconDefinition;
  faDollarSign =   faListAlt;
  feature:string="chat";
  private feature_sub:Subscription;
  signin_stat:string="Sign In";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userinfo: UserinfoService,
    private themeService: ThemeService,
  ) {
    // Make sure the page changes when the feature is changed in userinfo
    // this.feature_sub = userinfo.feature.subscribe(data=>{
    //   this.feature=data
    // });
  }

  ngOnInit() {
    this.setLightbulb();
    this.route.paramMap.pipe(
      switchMap((params: ParamMap)=>
        this.feature = params.get('feature')
      )
    );

  }


  toNotes(){
    this.feature="notes";
  }
  toChat(){
    this.feature="chat";
  }
  toSignin(){
    this.feature="signin";
  }

  setLightbulb() {
    if (this.themeService.isDarkTheme()) {
      this.faLightbulb = faRegularLightbulb;
    } else {
      this.faLightbulb = faSolidLightbulb;
    }
  }

  toggleTheme() {
    if (this.themeService.isDarkTheme()) {
      this.themeService.setLightTheme();
    } else {
      this.themeService.setDarkTheme();
    }

    this.setLightbulb();
  }
  ngOnDestroy() {
    this.feature_sub.unsubscribe();
  }
}
