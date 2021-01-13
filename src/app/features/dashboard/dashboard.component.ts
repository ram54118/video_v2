import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceInfoService } from '../../services/device-info.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends DeviceInfoService implements OnInit {
  public isIphone: boolean;
  constructor(private router: Router, private route: ActivatedRoute) {
    super();
  }
  ngOnInit() {
    this.isIphone = this.isIOSDevice();
  }

  navigateToScreen(url: string) {
    this.router.navigateByUrl(`dashboard/${url}`);
  }
}
