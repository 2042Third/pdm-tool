import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NavComponent } from "./nav/nav.component";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialExampleModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import {PlatformRoutingModule} from './platform-routing.module';
import {SecurityModule} from '../security/security.module';
@NgModule({
  exports:[
    NavComponent,
    PlatformComponent,
    // DialogNotificationsComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    SecurityModule,
    PlatformRoutingModule,
  ],
  declarations: [
    PlatformComponent,
    NavComponent,
    // UserioComponent,
    // MainViewComponent
  ]
})
export class PlatformModule { }
