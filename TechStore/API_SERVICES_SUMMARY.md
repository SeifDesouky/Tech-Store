# API Services & Core Implementation Summary

## 📂 New Services
All services have been generated in `src/app/core/services/` with strict typing and full API coverage.

1. **UsersService** (`users.service.ts`)
   - Authentication (Login, Register, Social, 2FA)
   - Profile management with file upload
   - Admin user management

2. **ProductsService** (`products.service.ts`)
   - CRUD operations with FormData (images)
   - Stock & visibility management
   - Advanced filtering & searching
   - Admin & Seller dashboards

3. **PromosService** (`promos.service.ts`)
   - Promotion management
   - Coupon application logic

4. **ReviewsService** (`reviews.service.ts`)
   - Product reviews & ratings
   - Helpful voting

5. **OrdersService** (`orders.service.ts`)
   - Order placement & cancellation
   - Return requests
   - Order history & tracking

6. **TicketsService** (`tickets.service.ts`)
   - Support ticket system
   - Conversation/Chat handling

7. **FaqsService** (`faqs.service.ts`)
   - FAQ listing & management

---

## 🛡️ New Guards
Located in `src/app/core/guards/`:

1. **AuthGuard**: Basic authentication check.
2. **AdminGuard**: Restricted to 'admin' role.
3. **SellerGuard**: Restricted to 'seller' role.
4. **BuyerGuard**: Restricted to 'buyer' role.
5. **SupportGuard**: Restricted to 'support' or 'admin' roles.

---

## 🔒 Interceptors
Located in `src/app/core/interceptors/`:

1. **AuthInterceptor**: Attaches Bearer token (skips login/register).
2. **ErrorInterceptor**: Handles 401 (logout), 403, and global errors.
3. **LoadingInterceptor**: Manages global loading state.

---

## 📦 Models
Located in `src/app/core/models/`:
- `user.model.ts`
- `product.model.ts`
- `promo.model.ts`
- `review.model.ts`
- `order.model.ts`
- `ticket.model.ts`
- `faq.model.ts`

## 🚀 Usage Example

```typescript
// Component Example
constructor(
  private productsService: ProductsService,
  private cartService: CartService // Your cart logic
) {}

loadProducts() {
  const filters: ProductQueryParams = {
    category: 'Laptops',
    minPrice: 1000,
    sort: 'price_asc'
  };

  this.productsService.getAllProducts(filters).subscribe({
    next: (response) => {
      this.products = response.products;
    },
    error: (err) => console.error(err)
  });
}

createProduct(data: CreateProductRequest, files: File[]) {
  this.productsService.createProduct(data, files).subscribe();
}
```
