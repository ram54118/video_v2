import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isInvalidCredentials: boolean;
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'userName': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const values = this.loginForm.value;
      if (values.userName === 'admin' && values.password === 'admin') {
        this.isInvalidCredentials = false;
        this.authService.login();
        this.router.navigateByUrl('dashboard');
      } else {
        this.isInvalidCredentials = true;
      }
    }
  }
}
