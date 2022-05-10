/**
 * By Yang Yi
 *  2/2022
 *
*/
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {UserinfoService} from '../../_services/Userinfo.service';
import { Subscription,Observable } from 'rxjs';
import {
  faLightbulb as faSolidLightbulb,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as faRegularLightbulb,  } from "@fortawesome/free-regular-svg-icons";
import { ThemeService } from "src/app/theme/theme.service";

import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements AfterViewInit {
  faLightbulb!: IconDefinition;
  feature:string="chat";
  private feature_sub:Subscription;
  signin_stat_str:string="Not Signed In";
  signin_stat:boolean=false;

  // elements
  @ViewChild(MatDrawerContainer) matDrawerContainer: MatDrawerContainer;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userinfo: UserinfoService,
    private themeService: ThemeService,
  ) {
    this.feature_sub = this.userinfo.signin_status.subscribe(

      data=>{
        // this.signin_stat_str=" \n\t";
        this.signin_stat_str = data.receiver;
        if(this.signin_stat_str != null){
          this.signin_stat = true;
        }
        else {
          this.signin_stat_str="Not Signed In";
          this.signin_stat = false;
        }
      });

  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    // this.matDrawerContainer.open();
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
