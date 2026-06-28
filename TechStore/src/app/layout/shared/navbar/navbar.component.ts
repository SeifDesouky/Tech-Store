import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LoginService } from '../../../core/services/Login/login.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private loginModal: LoginService,public authService: AuthService) { }

  openLogin() {
    this.loginModal.openLogin();
  }

  openRegister() {
    this.loginModal.openRegister();
  }

}
