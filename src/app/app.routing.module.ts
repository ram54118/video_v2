import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DroneLiveComponent } from './features/drone-live/drone-live.component';
import { IphoneLiveComponent } from './features/iphone-live/iphone-live.component';
import { LoginComponent } from './features/login/login.component';
import { WebCamLiveComponent } from './features/webcam-live/webcam-live.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    // canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      { path: 'webcamLive', component: WebCamLiveComponent },
      { path: 'droneLive', component: DroneLiveComponent },
      { path: 'iPhoneLive', component: IphoneLiveComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingmodule {}
