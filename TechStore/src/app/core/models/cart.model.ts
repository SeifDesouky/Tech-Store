import { Product } from "./product.model";

export interface CartItem {
    _id: string; // item_id
    product: Product; // Populated product
    quantity: number;
    price: number;
    total: number;
}

export interface Cart {
    _id: string;
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    discount: number;
    finalPrice: number;
    coupon?: string;
}

export interface Address {
    _id?: string;
    label: string;
    street: string;
    city: string;
    governorate: string;
    zipCode: string;
    isDefault: boolean;
}

export interface AddToCartRequest {
    product_id: string;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface ApplyPromoRequest {
    promotionCode: string;
}

export interface CheckoutRequest {
    paymentMethod: 'Online' | 'COD';
    shippingAddressId: string;
    deliveryMethod: 'standard' | 'express'; // guessing 'standard' based on doc
}

export interface CartSummaryResponse {
    cart: Cart;
}

export interface MessageResponse {
    message: string;
}
