import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GuestCartItem {
    productId: string;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class GuestCartService {
    private readonly STORAGE_KEY = 'guest_cart';
    private cartItemsSubject = new BehaviorSubject<GuestCartItem[]>(this.loadGuestCart());

    // Observable for components to subscribe to cart changes
    cartItems$ = this.cartItemsSubject.asObservable();

    constructor() { }

    /**
     * Load guest cart from localStorage
     */
    private loadGuestCart(): GuestCartItem[] {
        try {
            const cart = localStorage.getItem(this.STORAGE_KEY);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading guest cart:', error);
            return [];
        }
    }

    /**
     * Save guest cart to localStorage
     */
    private saveGuestCart(items: GuestCartItem[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
            this.cartItemsSubject.next(items);
        } catch (error) {
            console.error('Error saving guest cart:', error);
        }
    }

    /**
     * Get all guest cart items
     */
    getGuestCart(): GuestCartItem[] {
        return this.cartItemsSubject.value;
    }

    /**
     * Add item to guest cart or update quantity if exists
     */
    addToGuestCart(productId: string, quantity: number = 1): void {
        const items = this.getGuestCart();
        const existingItem = items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({ productId, quantity });
        }

        this.saveGuestCart(items);
    }

    /**
     * Update item quantity in guest cart
     */
    updateGuestCartItem(productId: string, quantity: number): void {
        const items = this.getGuestCart();
        const item = items.find(i => i.productId === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeFromGuestCart(productId);
            } else {
                item.quantity = quantity;
                this.saveGuestCart(items);
            }
        }
    }

    /**
     * Remove item from guest cart
     */
    removeFromGuestCart(productId: string): void {
        const items = this.getGuestCart().filter(item => item.productId !== productId);
        this.saveGuestCart(items);
    }

    /**
     * Clear all guest cart items
     */
    clearGuestCart(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.cartItemsSubject.next([]);
    }

    /**
     * Get total number of items in guest cart
     */
    getGuestCartCount(): number {
        return this.getGuestCart().reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Check if guest cart has items
     */
    hasGuestCartItems(): boolean {
        return this.getGuestCart().length > 0;
    }
}
