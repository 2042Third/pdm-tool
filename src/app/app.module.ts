import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlatformModule } from './platform/platform.module';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import {APP_BASE_HREF} from '@angular/common';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SecurityModule } from './security/security.module';
import { ChatService } from './_services/chat.service';


@NgModule({
  declarations: [
    AppComponent,
   ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    PlatformModule,
    HttpClientModule,
    SecurityModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/web_notes'},
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
