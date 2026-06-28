# Promo Code Persistence Fix - Cart to Payment

## Problem
When applying a promo code in the cart component, the discount was only calculated on the frontend. When navigating to the payment page, the discount was lost because it wasn't persisted to the backend cart.

## Root Cause
The cart component was using `PromosService.applyPromo()` which only **validates** the promo code and returns the discount amount, but doesn't actually apply it to the backend cart. This meant:
- ✅ Discount showed in cart page (frontend only)
- ❌ Discount lost when navigating to payment page
- ❌ Backend cart didn't know about the promo

## Solution
Changed the implementation to use `CartService.applyPromo()` which **applies the promo to the backend cart**. Now:
- ✅ Promo is saved to backend cart
- ✅ Discount persists across page navigation
- ✅ Payment page shows correct discounted total

## Changes Made

### 1. Updated `applyCoupon()` Method
**Before:**
```typescript
this.promosService.applyPromo({
  code: this.couponCode.trim(),
  totalAmount: this.totals?.total || (this.subtotal + this.fee)
}).subscribe({
  next: (res) => {
    this.appliedPromo = res.promo;
    this.promoDiscount = res.discount; // Only frontend state
    this.isApplyingPromo = false;
  }
});
```

**After:**
```typescript
this.cartService.applyPromo(this.couponCode.trim()).subscribe({
  next: (res) => {
    console.log('Promo applied to cart:', res);
    this.isApplyingPromo = false;
    // Reload cart to get updated totals with discount from backend
    this.loadCart();
    // Set applied promo for UI display
    this.appliedPromo = { code: this.couponCode.trim() };
  }
});
```

**Key Changes:**
- Uses `CartService.applyPromo()` instead of `PromosService.applyPromo()`
- Reloads cart after applying promo to get updated totals from backend
- Backend now stores the promo code and calculates discount

### 2. Updated `removePromo()` Method
**Before:**
```typescript
removePromo(): void {
  this.couponCode = '';
  this.appliedPromo = null;
  this.promoDiscount = 0;
  this.promoError = '';
}
```

**After:**
```typescript
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
```

**Key Changes:**
- Calls backend API to remove promo from cart
- Reloads cart to get updated totals

### 3. Updated Discount Getters
**Before:**
```typescript
get discount(): number {
  return this.promoDiscount || this.totals?.discount || 0;
}

get orderTotal(): number {
  const baseTotal = this.totals?.total || (this.subtotal + this.fee);
  return Math.max(0, baseTotal - this.promoDiscount);
}
```

**After:**
```typescript
get discount(): number {
  // Use discount from backend totals (after promo is applied)
  return this.totals?.discount || 0;
}

get orderTotal(): number {
  // Use total from backend (already includes discount calculation)
  return this.totals?.total || (this.subtotal + this.fee);
}
```

**Key Changes:**
- Removed frontend `promoDiscount` calculation
- Now uses discount from backend `totals` object
- Backend calculates the final total with discount applied

### 4. Updated `loadCart()` Method
**Added promo detection:**
```typescript
// Check if promo is applied from backend
if (this.cart?.promoCode) {
  this.appliedPromo = { code: this.cart.promoCode };
  this.couponCode = this.cart.promoCode;
} else {
  this.appliedPromo = null;
  this.couponCode = '';
}
```

**Key Changes:**
- Detects if backend cart has a promo code applied
- Displays promo badge if promo exists
- Ensures UI state matches backend state

## Flow Comparison

### Before (Broken)
```
Cart Page:
1. User enters promo code
2. Frontend validates with PromosService
3. Frontend calculates discount (200 EG)
4. Frontend shows: Total = 900 EG ✓
5. User clicks "Proceed to Checkout"

Payment Page:
6. Loads cart from backend
7. Backend cart has NO promo applied
8. Shows: Total = 1,100 EG ✗ (discount lost!)
```

### After (Fixed)
```
Cart Page:
1. User enters promo code
2. Frontend calls CartService.applyPromo()
3. Backend applies promo to cart
4. Backend calculates discount (200 EG)
5. Frontend reloads cart
6. Shows: Total = 900 EG ✓

Payment Page:
7. Loads cart from backend
8. Backend cart HAS promo applied
9. Shows: Total = 900 EG ✓ (discount persists!)
```

## Backend Requirements

Your backend must:
1. ✅ Have `POST /api/cart/apply-promo` endpoint
2. ✅ Store `promoCode` in cart document
3. ✅ Calculate discount and include in `totals.discount`
4. ✅ Return discounted total in `totals.total`
5. ✅ Have `DELETE /api/cart/remove-promo` endpoint

## Testing

### Test Case 1: Apply Promo
1. Add items to cart
2. Enter valid promo code
3. Click "Apply"
4. ✅ Discount shows in cart
5. Click "Proceed to Checkout"
6. ✅ Discount shows in payment page
7. ✅ Total matches cart total

### Test Case 2: Remove Promo
1. Apply promo code
2. Click remove (×) button
3. ✅ Discount removed from cart
4. Navigate to payment
5. ✅ No discount in payment

### Test Case 3: Page Refresh
1. Apply promo code
2. Refresh cart page
3. ✅ Promo badge still shows
4. ✅ Discount still applied

## Summary

The fix ensures that promo codes are **persisted to the backend cart** instead of just being calculated on the frontend. This means:

✅ Discount persists across page navigation
✅ Cart and payment pages show same total
✅ Promo survives page refreshes
✅ Backend has single source of truth
✅ No data loss when navigating

The implementation now correctly uses the backend cart as the source of truth for all pricing, including discounts! 🎉
