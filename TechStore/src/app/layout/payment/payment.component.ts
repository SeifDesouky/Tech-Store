import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Address } from '../../core/models/user.model';
import { OrdersService } from '../../core/services/orders.service';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  selectedPayment: string = 'credit-card';
  paymentMap: Record<string, 'COD' | 'Online'> = {
    'cash': 'COD',
    'credit-card': 'Online',
    'paypal': 'Online',
    'google-pay': 'Online'
  };
  cardNumber: string = '';
  cardName: string = '';
  expiryDate: string = '';
  cvv: string = '';

  agreeToTerms: boolean = false;

  cartItems: any[] = [];
  cart: any = null;
  fee: number = 100; // Default shipping fee

  isLoading = false;
  addresses: Address[] = [];
  selectedAddressId: string = '';
  totals: {
    subtotal: number;
    vat: number;
    deliveryFee: number;
    total: number;
    discount?: number;
  } | null = null;


  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.loadCart();
    this.loadUser();
  }

  loadCart() {
    this.isLoading = true;

    this.cartService.getMyCart().subscribe({
      next: (res: any) => {
        this.cart = res.cart;
        this.totals = res.totals;

        this.cartItems = (this.cart.items || []).map((item: any) => ({
          id: item._id,
          name: item.product.name,
          price: item.product.price, // ✅ السعر الصح
          quantity: item.quantity,
          image: item.product.images?.[0] || 'assets/no-image.png'
        }));

        this.fee = this.totals?.deliveryFee || 0;
        this.isLoading = false;

        if (this.cartItems.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
  loadUser() {
    this.isLoading = true;
    const userId = this.authService.getCurrentUser()?._id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.usersService.getUserById(userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.addresses = res.user.addresses || [];

        if (this.addresses.length === 0) {
          // لو مفيش عنوان، روح للصفحة الخاصة بإضافة عنوان
          this.router.navigate(['/user/address']);
          return;
        }

        // اختيار العنوان الافتراضي
        const defaultAddr = this.addresses.find(a => a.isDefault);
        this.selectedAddressId = defaultAddr ? defaultAddr._id! : this.addresses[0]._id!;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        if (err.status === 401) this.router.navigate(['/login']);
      }
    });
  }

  // وظيفة لتوجيه المستخدم لإضافة عنوان
  goToAddAddress() {
    this.router.navigate(['/user/address']);
  }



  get subtotal(): number {
    return this.totals?.subtotal || 0;
  }

  get discount(): number {
    return this.totals?.discount || 0;
  }

  get orderTotal(): number {
    return this.totals?.total || 0;
  }


  selectPayment(method: string): void {
    this.selectedPayment = method;
  }

  processPayment(): void {
    if (!this.agreeToTerms) {
      alert('Please agree to Terms & Conditions');
      return;
    }

    const selectedAddress = this.addresses.find(
      a => a._id === this.selectedAddressId
    );

    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    this.isLoading = true;



    this.ordersService.createOrder({
      paymentMethod: this.paymentMap[this.selectedPayment],
      shippingAddress: {
        address: selectedAddress.street,
        city: selectedAddress.city,
        governorate: selectedAddress.governorate,
        postalCode: selectedAddress.zipCode,
        country: 'Egypt',
        phone: this.authService.getCurrentUser()?.phone || ''
      }
    }).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.router.navigate(['/user/orders']);
      },
      error: (err) => {
        alert(err.error?.message || 'Checkout failed');
        this.isLoading = false;
      }
    });
  }


  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }
}
