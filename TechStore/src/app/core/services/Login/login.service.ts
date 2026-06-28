import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private showLoginSubject = new BehaviorSubject<boolean>(false);
  showLogin$ = this.showLoginSubject.asObservable();

  private showRegisterSubject = new BehaviorSubject<boolean>(false);
  showRegister$ = this.showRegisterSubject.asObservable();

  private showForgotSubject = new BehaviorSubject<boolean>(false);
  showForgot$ = this.showForgotSubject.asObservable();

  openLogin() {
    this.closeAll();
    this.showLoginSubject.next(true);
  }

  closeLogin() {
    this.showLoginSubject.next(false);
  }

  openRegister() {
    this.closeAll();
    this.showRegisterSubject.next(true);
  }

  closeRegister() {
    this.showRegisterSubject.next(false);
  }

  openForgot() {
    this.closeAll();
    this.showForgotSubject.next(true);
  }

  closeForgot() {
    this.showForgotSubject.next(false);
  }

  private closeAll() {
    this.showLoginSubject.next(false);
    this.showRegisterSubject.next(false);
    this.showForgotSubject.next(false);
  }

  // maintain backward compatibility if 'open'/'close' were strictly for login
  open() {
    this.openLogin();
  }

  close() {
    this.closeLogin();
  }
}
