import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cc20Component } from './cc20/cc20.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClient,HttpClientModule } from "@angular/common/http";
// import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { FormsModule,
  ReactiveFormsModule, } from "@angular/forms";
import { HumanizeTimePipe } from "./humanize-time-pipe";
import { NotesComponent } from './notes/notes.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { DisableControlDirective } from './disableControl.directive';
@NgModule({
  exports:[Cc20Component,
     NotesComponent,
     SigninComponent,
     UserprofileComponent
    ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [	
    Cc20Component,
    HumanizeTimePipe,
    NotesComponent,
    SigninComponent,
    UserprofileComponent,
    SafeHtmlPipe,
      DisableControlDirective
   ]
})
export class SecurityModule { }
