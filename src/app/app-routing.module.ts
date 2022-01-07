import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Cc20Component } from './security/cc20/cc20.component';


const routes: Routes = [
  {
    path: "cc20",
    component: Cc20Component,
    data: { demo: false, name: "cc20 crypt module" },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
   declarations: [
  ],
})
export class AppRoutingModule {}
