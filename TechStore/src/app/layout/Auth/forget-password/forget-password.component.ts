import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginService } from '../../../core/services/Login/login.service';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  @Output() close = new EventEmitter<void>();
  forgotForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ... getters ...

  onOverlayClick(): void {
    this.close.emit();
  }

  onLoginClick(): void {
    this.loginService.openLogin();
  }

  // ... onSubmit ...

  get email() { return this.forgotForm.get('email'); }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.showSuccess = false;

    this.authService.forgotPassword(this.email?.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showSuccess = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to send reset email';
      }
    });
  }
}
