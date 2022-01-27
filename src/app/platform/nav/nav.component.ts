// import { NotesComponent } from './../../security/notes/notes.component';
import { Component, OnInit } from '@angular/core';
import {
  faLightbulb as faSolidLightbulb,
  faListAlt,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as faRegularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { ThemeService } from "src/app/theme/theme.service";
// import { Cc20Component } from 'src/app/security/cc20/cc20.component';
// import { SigninComponent } from 'src/app/security/signin/signin.component';
// import { MainViewComponent } from '../main_view/main_view.component';


@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  faLightbulb!: IconDefinition;
  faDollarSign =   faListAlt;
  feature:string="chat";
  signin_stat:string="Sign In";
  // main!:MainViewComponent;
  constructor(
    private themeService: ThemeService,
  ) {
    // main = MainViewComponent;

  }

  ngOnInit() {
    this.setLightbulb();
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
}
