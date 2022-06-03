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
import { NotesService } from './_services/notes.service';
import { AuthService } from './_services/auth.service';
import { NotesEditDirective } from './_directives/notes-edit.directive';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { UserinfoService } from './_services/userinfos.service';


@NgModule({
  declarations: [
    AppComponent,
   ],
   exports:[

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
    ChatService,
    NotesService,
    AuthService,
    UserinfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
