import { WebCamLiveComponent } from './features/webcam-live/webcam-live.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { DroneLiveComponent } from './features/drone-live/drone-live.component';
import { IphoneLiveComponent } from './features/iphone-live/iphone-live.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
  {
    path: 'dashboard',
    // canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      { path: 'webcamLive', component: WebCamLiveComponent },
      { path: 'droneLive', component: DroneLiveComponent },
      { path: 'iPhoneLive', component: IphoneLiveComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingmodule { }