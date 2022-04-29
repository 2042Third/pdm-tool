import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { Cc20Component } from '../security/cc20/cc20.component';
import { NotesComponent } from '../security/notes/notes.component';
import { SigninComponent } from '../security/signin/signin.component';
import { UserprofileComponent } from '../security/userprofile/userprofile.component';

const pdmRoutes: Routes = [
  {path:'./notes', component: NotesComponent},
  {path:'./chat', component: Cc20Component},
  {path:'./signin', component: SigninComponent  },
  {path: '', redirectTo: './chat', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(pdmRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PlatformRoutingModule { }
