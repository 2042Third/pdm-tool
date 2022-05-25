import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cc20Component } from './cc20/cc20.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClient,HttpClientModule } from "@angular/common/http";
// import {Http, Response, RequestOptions, Headers} from '@angular/http';

import {MatDividerModule} from '@angular/material/divider';
import { FormsModule,ReactiveFormsModule, } from "@angular/forms";
import { HumanizeTimePipe } from "./humanize-time-pipe";
import { NotesComponent } from './notes/notes.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { DisableControlDirective } from './disableControl.directive';
import { ChatService } from '../_services/chat.service';
import { NotesEditDirective } from '../_directives/notes-edit.directive';
// import { EncryptComponent } from './encrypt/encrypt.component';
@NgModule({
  exports:[Cc20Component,
     NotesComponent,
     SigninComponent,
     UserprofileComponent,
    // NotesEditDirective,
    ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
  ],
  declarations: [
    Cc20Component,
    HumanizeTimePipe,
    NotesComponent,
    SigninComponent,
    UserprofileComponent,
    SafeHtmlPipe,
    DisableControlDirective,
    NotesEditDirective,
    // EncryptComponent
   ],
  providers: [
    ChatService,
  ]
})
export class SecurityModule { }
