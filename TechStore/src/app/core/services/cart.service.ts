import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    AddToCartRequest,
    UpdateCartItemRequest,
    ApplyPromoRequest,
    Address,
    CheckoutRequest,
    CartSummaryResponse,
    MessageResponse
} from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly API_URL = `${environment.apiUrl}/cart`;

    constructor(private http: HttpClient) { }

    getMyCart(): Observable<MessageResponse> {
        return this.http.get<MessageResponse>(`${this.API_URL}/`, { withCredentials: true });
    }
    // 1. Add to cart
    addToCart(productId: string): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(`${this.API_URL}/add`, { product_id: productId }, { withCredentials: true });
    }

    // 2. Update cart item quantity
    updateCartItem(itemId: string, quantity: number): Observable<MessageResponse> {
        return this.http.put<MessageResponse>(`${this.API_URL}/update/${itemId}`, { quantity }, { withCredentials: true });
    }

    // 3. Remove item from cart
    removeItem(itemId: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.API_URL}/remove/${itemId}`);
    }

    // 4. Remove all cart
    clearCart(): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.API_URL}/clear`);
    }

    // 5. Apply promo code
    applyPromo(promotionCode: string): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(`${this.API_URL}/apply-promo`, { promotionCode });
    }

    // 6. Remove promo code
    removePromo(): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.API_URL}/remove-promo`);
    }

    // 7. Apply user address (Add address)
    addAddress(address: Address): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(`${this.API_URL}/address`, address);
    }

    // 8. Get all user addresses
    getAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.API_URL}/addresses`);
    }

    // 9. Get cart summary
    getCartSummary(): Observable<CartSummaryResponse> {
        return this.http.get<CartSummaryResponse>(`${this.API_URL}/summary`);
    }

    // 10. Checkout order
    checkout(data: CheckoutRequest): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(`${this.API_URL}/checkout`, data);
    }

    // 11. Update user address
    updateAddress(addressId: string, address: Address): Observable<MessageResponse> {
        return this.http.put<MessageResponse>(`${this.API_URL}/address/${addressId}`, address);
    }

    // 12. Remove user address
    removeAddress(addressId: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.API_URL}/address/${addressId}`);
    }

    // 13. Merge guest cart items into authenticated user cart
    mergeGuestCart(guestItems: { productId: string; quantity: number }[]) {
        return this.http.post(
            `${this.API_URL}/merge-guest-cart`,
            { items: guestItems },
            { withCredentials: true }
        );
    }

    // 14. Clear entire cart
    // clearCart(): Observable<MessageResponse> {
    //     return this.http.delete<MessageResponse>(`${this.API_URL}/clear`);
    // }

}
