import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginService } from '../../core/services/Login/login.service';
import { GuestCartService } from '../../core/services/guest-cart.service';
import { ProductsService } from '../../core/services/products.service';
import { PromosService } from '../../core/services/promos.service';



@Component({
  selector: 'app-cart',
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
isLoggedIn: boolean = false;

  cartItems: any[] = [];
  totals: any = null;
  cart: any = null;
  fee: number = 0;
  couponCode: string = '';
  loading: boolean = false;

  // Promo code properties
  appliedPromo: any = null;
  promoDiscount: number = 0;
  promoError: string = '';
  isApplyingPromo: boolean = false;

  // Available promos
  availablePromos: any[] = [];
  showPromoList: boolean = false;
  loadingPromos: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService,
    private guestCartService: GuestCartService,
    private productsService: ProductsService,
    private promosService: PromosService
  ) { }

  ngOnInit() {
    this.isLoggedIn = !!this.authService.getCurrentUser();
    this.loadCart();
    this.loadAvailablePromos();
  }

  /**
   * Load available public promos
   */
  loadAvailablePromos() {
    this.loadingPromos = true;
    this.promosService.getPublicPromos().subscribe({
      next: (res) => {
        this.availablePromos = res.promos || [];
        this.loadingPromos = false;
      },
      error: (err) => {
        console.error('Error loading promos:', err);
        this.loadingPromos = false;
      }
    });
  }

  /**
   * Toggle promo list visibility
   */
  togglePromoList() {
    this.showPromoList = !this.showPromoList;
  }

  /**
   * Quick apply promo from list
   */
  quickApplyPromo(promoCode: string) {
    this.couponCode = promoCode;
    this.applyCoupon();
    this.showPromoList = false;
  }
  loadCart() {
    this.loading = true;

    // Check if user is authenticated
    if (this.authService.isLoggedIn()) {
      // Load cart from backend for authenticated users
      this.cartService.getMyCart().subscribe({
        next: (res: any) => {
          this.cart = res.cart;
          this.totals = res.totals;

          this.cartItems = (this.cart?.items || []).map((item: any) => ({
            id: item._id,                  // Cart Item ID
            productId: item.product._id,   // Product ID
            name: item.product.name,
            price: item.product.price,
            image: item.product.images?.[0] || 'assets/no-image.png',
            quantity: item.quantity
          }));

          this.fee = this.totals?.deliveryFee || 0;

          // Check if promo is applied from backend
          if (this.cart?.promoCode) {
            this.appliedPromo = { code: this.cart.promoCode };
            this.couponCode = this.cart.promoCode;
          } else {
            this.appliedPromo = null;
            this.couponCode = '';
          }

          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error('Error loading cart:', err);
        }
      });
    } else {
      // Load guest cart from localStorage
      this.loadGuestCart();
    }
  }

  /**
   * Load guest cart from localStorage and fetch product details
   */
  private loadGuestCart() {
    const guestItems = this.guestCartService.getGuestCart();

    if (guestItems.length === 0) {
      this.cartItems = [];
      this.loading = false;
      return;
    }

    // Fetch product details for each guest cart item
    const productRequests = guestItems.map(item =>
      this.productsService.getProductById(item.productId)
    );

    // Use forkJoin to wait for all product requests
    import('rxjs').then(({ forkJoin }) => {
      forkJoin(productRequests).subscribe({
        next: (responses: any[]) => {
          this.cartItems = responses.map((res, index) => {
            const product = res.product || res; // Handle ProductResponse format
            return {
              id: product._id,
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || 'assets/no-image.png',
              quantity: guestItems[index].quantity
            };
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading guest cart products:', err);
          this.loading = false;
        }
      });
    });
  }

  get subtotal(): number {
    return this.totals?.subtotal || 0;
  }

  get discount(): number {
    // Use discount from backend totals (after promo is applied)
    return this.totals?.discount || 0;
  }

  get orderTotal(): number {
    // Use total from backend if available (already includes discount calculation)
    if (this.totals?.total !== undefined) {
      return this.totals.total;
    }

    // Fallback calculation for guest cart (includes discount if any)
    const subtotal = this.subtotal;
    const fee = this.fee;
    const discount = this.discount;
    return Math.max(0, subtotal + fee - discount);
  }

  increaseQuantity(item: any): void {
    this.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      // Use the correct ID based on authentication status
      const itemId = this.authService.isLoggedIn() ? item.id : item.productId;
      this.updateQuantity(itemId, item.quantity - 1);
    } else {
      // If quantity is 1, remove the item
      const itemId = this.authService.isLoggedIn() ? item.id : item.productId;
      this.removeItem(itemId);
    }
  }

  updateQuantity(itemId: string, quantity: number) {
    if (this.authService.isLoggedIn()) {
      // Update backend cart for authenticated users
      this.cartService.updateCartItem(itemId, quantity).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error updating quantity:', err)
      });
    } else {
      // Update guest cart in localStorage
      this.guestCartService.updateGuestCartItem(itemId, quantity);
      this.loadCart();
    }
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    const confirmed = confirm('Are you sure you want to clear your entire cart?');
    if (!confirmed) return;

    if (this.authService.isLoggedIn()) {
      // Clear backend cart
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCart();
          alert('Cart cleared successfully');
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
          alert('Failed to clear cart');
        }
      });
    } else {
      // Clear guest cart
      this.guestCartService.clearGuestCart();
      this.loadCart();
      alert('Cart cleared successfully');
    }
  }

  removeItem(itemId: any): void {
    const id = typeof itemId === 'string' ? itemId : itemId.toString();

    if (this.authService.isLoggedIn()) {
      // Remove from backend cart
      this.cartService.removeItem(id).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error(err)
      });
    } else {
      // Remove from guest cart
      this.guestCartService.removeFromGuestCart(id);
      this.loadCart();
    }
  }

  /**
   * Apply promo code
   */
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.promoError = 'Please enter a promo code';
      return;
    }

    // Only authenticated users can apply promos
    if (!this.authService.isLoggedIn()) {
      this.promoError = 'Please login to apply promo codes';
      this.loginService.openLogin();
      return;
    }

    this.isApplyingPromo = true;
    this.promoError = '';

    // Use CartService to apply promo to backend cart
    this.cartService.applyPromo(this.couponCode.trim()).subscribe({
      next: (res) => {
        console.log('Promo applied to cart:', res);
        this.isApplyingPromo = false;
        // Reload cart to get updated totals with discount
        this.loadCart();
        // Set applied promo for UI display
        this.appliedPromo = { code: this.couponCode.trim() };
      },
      error: (err) => {
        this.promoError = err.error?.message || 'Invalid promo code';
        this.isApplyingPromo = false;
        this.appliedPromo = null;
        this.promoDiscount = 0;
      }
    });
  }

  /**
   * Remove applied promo code
   */
  removePromo(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.cartService.removePromo().subscribe({
      next: () => {
        this.couponCode = '';
        this.appliedPromo = null;
        this.promoDiscount = 0;
        this.promoError = '';
        // Reload cart to get updated totals without discount
        this.loadCart();
      },
      error: (err) => {
        console.error('Error removing promo:', err);
      }
    });
  }

  // proceedToCheckout(): void {
  //   this.router.navigate(['/payment']);
  // }
  // في cart.component.ts

  proceedToCheckout(): void {
    // نتحقق أولاً هل المستخدم مسجل دخول أم لا
    if (this.authService.isLoggedIn()) {
      // (افترض وجود دالة في السيرفس تتحقق من وجود التوكن)
      this.router.navigate(['/payment']);
    } else {
      // فتح نافذة الدخول
      this.loginService.openLogin();
      // ملاحظة: بعد الدخول بنجاح، يجب أن يعود المستخدم هنا ويرى السلة محدثة
    }
  }
}