import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { WebcamModule } from 'ngx-webcam';
import { AppComponent } from './app.component';
import { AppRoutingmodule } from './app.routing.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DroneLiveComponent } from './features/drone-live/drone-live.component';
import { IphoneLiveComponent } from './features/iphone-live/iphone-live.component';
import { LoginComponent } from './features/login/login.component';
import { WebcamLiveDetectionComponent } from './features/webcam-live-detection/webcam-live-detection.component';
import { WebCamLiveComponent } from './features/webcam-live/webcam-live.component';
const config: SocketIoConfig = { url: window.location.origin, options: {} };

const materialModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTreeModule,
  MatBadgeModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule,
  MatTooltipModule,
  WebcamModule,
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    WebCamLiveComponent,
    DroneLiveComponent,
    IphoneLiveComponent,
    WebcamLiveDetectionComponent,
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingmodule,
    HttpClientModule,
    ...materialModules,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
