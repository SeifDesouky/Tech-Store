import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    CreateOrderRequest,
    CancelOrderRequest,
    ReturnOrderRequest,
    UpdateOrderStatusRequest,
    OrderResponse,
    OrdersListResponse, Order
} from '../models/order.model';

export interface SellerOrderStats {
    totalOrders: number;
    totalRevenue: number;
    totalItems: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
}

export interface SellerOrdersResponse {
    success: boolean;
    count: number;
    stats: SellerOrderStats;
    orders: any[];
}
@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private readonly API_URL = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    // ==================== USER ROUTES ====================

    /**
     * POST /api/orders
     * Place a new order
     */
    createOrder(data: CreateOrderRequest): Observable<OrderResponse> {
        return this.http.post<OrderResponse>(`${this.API_URL}`, data);
    }

    /**
     * GET /api/orders
     * Get current user's order history
     */
    getMyOrders(): Observable<OrdersListResponse> {
        return this.http.get<OrdersListResponse>(`${this.API_URL}`);
    }

    /**
     * GET /api/orders/:id
     * Get order details by ID
     */
    getOrderById(id: string): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${this.API_URL}/${id}`);
    }

    /**
     * PUT /api/orders/:id/cancel
     * Cancel an order (Before shipping)
     */
    cancelOrder(id: string, data: CancelOrderRequest): Observable<OrderResponse> {
        return this.http.put<OrderResponse>(`${this.API_URL}/${id}/cancel`, data);
    }

    /**
     * POST /api/orders/:id/return
     * Request a return (After delivery)
     */
    requestReturn(id: string, data: FormData): Observable<OrderResponse> {
        return this.http.post<OrderResponse>(`${this.API_URL}/${id}/return`, data);
    }

    // ==================== ADMIN ROUTES ====================

    /**
     * PUT /api/orders/:id
     * Update order status (Admin/Support only)
     */
    updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Observable<OrderResponse> {
        return this.http.put<OrderResponse>(`${this.API_URL}/${id}`, data);
    }

    getAllOrders(): Observable<{ count: number; orders: Order[] }> {
        return this.http.get<{ count: number; orders: Order[] }>(`${this.API_URL}`);
    }


    /**
     * DELETE /api/orders/:id/delete
     * Delete an order permanently (Admin only)
     */
    deleteOrder(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}/delete`);
    }
    getOrdersUserId(userId:string){
        return this.http.get(`${this.API_URL}/user/${userId}`)
    }

        getSellerOrders(filters?: {
        status?: string;
        paymentMethod?: string;
        orderNumber?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Observable<SellerOrdersResponse> {
        let params = new HttpParams();

        if (filters) {
            Object.keys(filters).forEach(key => {
                const value = (filters as any)[key];
                if (value) {
                    params = params.set(key, value);
                }
            });
        }

        return this.http.get<SellerOrdersResponse>(
            `${this.API_URL}/seller/my-orders`,
            { params }
        );
    }




}
