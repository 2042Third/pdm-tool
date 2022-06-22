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
import { CustomScrollDirective } from './_directives/custom-scroll.directive';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { IonicModule } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
// import { HTTP } from '@ionic-native/http/ngx';
const dbConfig: DBConfig = {
  name: 'pdmDB',
  version: 1,
  objectStoresMeta: [{
    store: 'pdmTable',
    storeConfig: {keyPath: 'id', autoIncrement: true},
    storeSchema: [
      {name: 'username', keypath: 'username', options: { unique: false}},
      {name: 'val', keypath: 'val', options: { unique: false}},
      {name: 'view', keypath: 'view', options: { unique: false}},
      {name: 'time', keypath: 'time', options: { unique: false}},
      {name: 'utime', keypath: 'utime', options: { unique: false}},
      {name: 'ctime', keypath: 'ctime', options: { unique: false}},
      {name: 'msg', keypath: 'msg', options: { unique: false}},
      {name: 'msgh', keypath: 'msgh', options: { unique: false}},
      {name: 'h', keypath: 'h', options: { unique: false}},
      {name: 'status', keypath: 'status', options: { unique: false}},
      {name: 'sess', keypath: 'sess', options: { unique: false}},
      {name: 'type', keypath: 'type', options: { unique: false}},
      {name: 'checker', keypath: 'checker', options: { unique: false}},
      {name: 'authdata', keypath: 'authdata', options: { unique: false}},
      {name: 'receiver', keypath: 'receiver', options: { unique: false}},
      {name: 'update_time', keypath: 'update_time', options: { unique: false}},
      {name: 'sender', keypath: 'sender', options: { unique: false}},
      {name: 'pdmSecurityVersion', keypath: 'pdmSecurityVersion', options: {unique:false}},
      {name: 'email', keypath: 'email', options: { unique: true}}
    ]
  },
  {
    store: 'pdmSecurity',
    storeConfig: {keyPath: 'id', autoIncrement: true},
    storeSchema: [
      {name: 'email', keypath: 'email', options: { unique: true}},
      {name: 'secure', keypath: 'secure', options: {unique:false}},
      {name: 'pdmSecurityVersion', keypath: 'pdmSecurityVersion', options: {unique:false}},
      {name: 'checker', keypath: 'checker', options: { unique: false}},
      {name: 'ponce_status', keypath: 'ponce_status', options:{unique:false}}
    ]
  },
  ]
};

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
    NgxIndexedDBModule.forRoot(dbConfig),
    IonicModule.forRoot(),
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/web_notes'},
    ChatService,
    NotesService,
    HTTP,
    AuthService,
    UserinfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
