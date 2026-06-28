import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-verify-2-fa',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-2-fa.component.html',
  styleUrl: './verify-2-fa.component.css',
})
export class Verify2FAComponent {
  verifyForm: FormGroup;
  isLoading = false;
  error = '';
  userId = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });

    // Attempt to get userId from query params or assume it's stored somewhere if this is post-login
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || '';
    });
  }

  get code() { return this.verifyForm.get('code'); }

  onSubmit() {
    if (this.verifyForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    const data = {
      userId: this.userId,
      code: this.code?.value
    };

    this.authService.verify2FA(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        // On success, maybe finish login? or navigate home
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Invalid code';
      }
    });
  }

  resendCode() {
    console.log('Resending verification code...');
    // Implement resend logic if API exists, currently mostly backend handled
  }
}
