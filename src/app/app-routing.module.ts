import { NgModule } from "@angular/core";
import { RouterModule, Routes , ActivatedRoute, ParamMap } from "@angular/router";
import { NavComponent } from "./platform/nav/nav.component";


const routes: Routes = [
  { path: 'signin', redirectTo: './signin' , pathMatch: 'full'},
  { path: 'notes', redirectTo: './notes' , pathMatch: 'full'},
  { path: '**', redirectTo: './chat' , pathMatch: 'full'},
  { path: '', redirectTo: './chat' , pathMatch: 'full'},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
   declarations: [
  ],
})
export class AppRoutingModule {}
