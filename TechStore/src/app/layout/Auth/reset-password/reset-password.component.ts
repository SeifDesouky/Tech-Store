import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginService } from '../../../core/services/Login/login.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  @Input() isModal: boolean = false;
  @Input() token: string = '';
  @Output() close = new EventEmitter<void>();

  resetForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (!this.token) {
      this.token = this.route.snapshot.params['token'];
    }
  }

  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.resetPassword(this.token, this.password?.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.success = true;
        if (!this.isModal) {
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          setTimeout(() => {
            this.close.emit();
            this.success = false; // Reset for next time if kept alive (though likely destroyed)
            this.resetForm.reset();
          }, 2000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to reset password';
      }
    });
  }
  
onLoginClick(): void {
    this.loginService.openLogin();
  }
}
