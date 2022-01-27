import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cc20Component } from './cc20/cc20.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { HumanizeTimePipe } from "./humanize-time-pipe";
import { NotesComponent } from './notes/notes.component';
@NgModule({
  exports:[Cc20Component, NotesComponent, SigninComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  declarations: [
    Cc20Component,
    HumanizeTimePipe,
    NotesComponent,
    SigninComponent,
    ]
})
export class SecurityModule { }
