import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainerAccessorLoginComponent } from './trainer-accessor-login/trainer-accessor-login.component';
import { LoginComponent } from './login/login.component';
import { EmploginComponent } from './emplogin/emplogin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'federationlogin', component: LoginComponent },
  { path: 'adminlogin', component: EmploginComponent },
  { path: 'login', component: TrainerAccessorLoginComponent },
  { path: 'allcomponent', loadChildren: () => import('./allothercomponents/allothercomponents.module').then(m => m.AllothercomponentsModule) },
  { path: 'report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule { }