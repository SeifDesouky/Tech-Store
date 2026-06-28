import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginService } from '../../../core/services/Login/login.service';
import { Router } from '@angular/router';
import { GuestCartService } from '../../../core/services/guest-cart.service';
import { CartService } from '../../../core/services/cart.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  isLoading = false;
  loginForm: FormGroup;
  hide = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private guestCartService: GuestCartService,
    private cartService: CartService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onOverlayClick(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login success', res);

        // Merge guest cart if exists
        this.mergeGuestCartIfExists();

        this.isLoading = false;
        this.close.emit();

        if (this.router.url === '/cart') {
          // Reload cart page to show merged items
          window.location.reload();
        } else if (res.user.role === 'admin') {
          this.router.navigateByUrl('/admin')
        }
        else if(res.user.role==='seller'){
          this.router.navigateByUrl('/seller')
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.error = err.error.message
      }
    });
  }

  onForgot(): void {
    this.loginService.openForgot();
  }

  onCreate(): void {
    this.loginService.openRegister();
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  onGoogleLogin() {
    console.log('Google login clicked');
  }

  onFacebookLogin() {
    console.log('Facebook login clicked');
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
