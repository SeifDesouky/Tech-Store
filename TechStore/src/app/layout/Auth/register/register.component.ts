import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/Login/login.service';
import { GuestCartService } from '../../../core/services/guest-cart.service';
import { CartService } from '../../../core/services/cart.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService,
    private guestCartService: GuestCartService,
    private cartService: CartService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['buyer', Validators.required]
    });
  }


  // ... getters ...

  onOverlayClick(): void {
    this.close.emit();
  }

  onLoginClick(): void {
    this.loginService.openLogin();
  }

  // ... (onSubmit remains mostly same but might need to close overlay or specific behavior success)

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get role() { return this.registerForm.get('role'); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }



  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const role = this.registerForm.value.role;
    const credentials = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        if (role === 'seller') {
          this.isLoading = false;
          alert('Your seller account is pending admin approval. You will receive an email once approved.');
          this.loginService.openLogin();
        } else {
          // Auto-login buyer after registration
          this.authService.login(credentials).subscribe({
            next: (res) => {
              console.log('Auto-login after registration successful', res);

              // Merge guest cart if exists
              this.mergeGuestCartIfExists();

              this.isLoading = false;
              this.close.emit();

              // Redirect to home or cart page
              if (this.router.url === '/cart') {
                window.location.reload();
              }
            },
            error: (loginErr) => {
              console.error('Auto-login failed:', loginErr);
              this.isLoading = false;
              // Fall back to opening login modal
              this.loginService.openLogin();
            }
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }

  /**
   * Merge guest cart items with authenticated user's cart
   */
  private mergeGuestCartIfExists(): void {
    const guestCartItems = this.guestCartService.getGuestCart();

    if (guestCartItems.length > 0) {
      console.log('Merging guest cart items:', guestCartItems);

      // Call backend API to merge guest cart
      this.cartService.mergeGuestCart(guestCartItems).subscribe({
        next: (res) => {
          console.log('Guest cart merged successfully:', res);
          // Clear guest cart from localStorage after successful merge
          this.guestCartService.clearGuestCart();
        },
        error: (err) => {
          console.error('Error merging guest cart:', err);
          // Still clear guest cart even on error to avoid duplicate attempts
          this.guestCartService.clearGuestCart();
        }
      });
    }
  }

}
