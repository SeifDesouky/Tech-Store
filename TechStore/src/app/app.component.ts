import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/services/Login/login.service';
import { LoginComponent } from "./layout/Auth/login/login.component";
import { RegisterComponent } from "./layout/Auth/register/register.component";
import { ForgetPasswordComponent } from "./layout/Auth/forget-password/forget-password.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegisterComponent, ForgetPasswordComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'techStore';
  showLogin = false;
  showRegister = false;
  showForgot = false;

  constructor(public loginModal: LoginService) {
    this.loginModal.showLogin$.subscribe(value => {
      this.showLogin = value;
    });
    this.loginModal.showRegister$.subscribe(value => {
      this.showRegister = value;
    });
    this.loginModal.showForgot$.subscribe(value => {
      this.showForgot = value;
    });
  }
}
