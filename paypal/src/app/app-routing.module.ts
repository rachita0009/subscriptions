import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaypalComponent } from './paypal/paypal.component';
import { RegisterComponent } from './register/register.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

const routes: Routes = [
  {path:'paypal', component: PaypalComponent},
  {path :'subscribe',component: SubscribeComponent},
  {path:'',component:RegisterComponent},
  {path:'dashboard',component:DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
