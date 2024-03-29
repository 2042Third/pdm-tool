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
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import { CustomScrollDirective } from '../_directives/custom-scroll.directive';
import { EncryptionComponent } from './encryption/encryption.component';
import {MatInputModule} from "@angular/material/input";
@NgModule({
  exports:[Cc20Component,
     NotesComponent,
     SigninComponent,
     UserprofileComponent,
     EncryptionComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatListModule,
        MatInputModule,
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
    CustomScrollDirective,
    EncryptionComponent,
   ],
})
export class SecurityModule { }
