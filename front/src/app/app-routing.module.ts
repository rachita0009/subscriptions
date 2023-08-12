import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipComponent } from './membership/membership.component';
import { SuscribeComponent } from './suscribe/suscribe.component';

const routes: Routes = [
  {path:'',component: MembershipComponent},
  {path:'suscribe',component:SuscribeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
