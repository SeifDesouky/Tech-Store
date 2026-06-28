import { Governorate } from "./user.model";

export interface ShippingAddress {
    address: string;
    city: string;
    governorate:string
    postalCode?: string;
    country: string;
    phone: string;
}

export interface OrderItem {
    product: string | {
        _id: string;
        name: string;
        price: number;
        images?: string[];
    };
    quantity: number;
    condition: 'New' | 'Used' | 'Imported';
    price?: number;
}

export interface Order {
    _id: string;
    orderNumber?: string;
    user: string | {
        _id: string;
        name: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: ShippingAddress;
    deliveryFee:number;
    internalNotes?:string
    paymentMethod: 'COD' | 'CreditCard' | 'PayPal';
    paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
    trackingNumber?: string;
    promo?: string;
    discount?: number;
    cancellationReason?: string;
    returnRequest?: {
        reason: string;
        comment: string;
        proofImages: string[];
        status: 'Pending' | 'Approved' | 'Rejected';
        requestedAt: string;
    };
    createdAt: string;
    updatedAt?: string;
    deliveredAt?: string;
}

// Request DTOs
export interface CreateOrderRequest {
  paymentMethod: 'COD' | 'Online';
  shippingAddress: {
    address: string;
    city: string;
    governorate: Governorate;
    postalCode?: string;
    country: string;
    phone: string;
  };
}


export interface CancelOrderRequest {
    reason: 'Changed my mind' | 'Found better price' | 'Ordered by mistake' | 'Shipping takes too long' | 'Other';
}

export interface ReturnOrderRequest {
    reason: 'Product defective/damaged'| 'Wrong item received'| 'Product doesn\'t match description'| 'Missing accessories/parts';
    comment: string;
    proofImages: string[];
    status:'Return Requested'| 'Return Approved'| 'Return Rejected'| 'Refund Processed'
}

export interface UpdateOrderStatusRequest {
    status?: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
    trackingNumber?: string;
    internalNotes?:string
}

// Response DTOs
export interface OrderResponse {
    success: boolean;
    message: string;
    order: Order;
}

export interface OrdersListResponse {
    success: boolean;
    orders: Order[];
    total?: number;
}

