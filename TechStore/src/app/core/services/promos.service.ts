import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    CreatePromoRequest,
    UpdatePromoRequest,
    ApplyPromoRequest,
    PromoResponse,
    PromosListResponse,
    ApplyPromoResponse,
    PromoStatsResponse
} from '../models/promo.model';

@Injectable({
    providedIn: 'root'
})
export class PromosService {
    private readonly API_URL = `${environment.apiUrl}/promos`;

    constructor(private http: HttpClient) { }

    // ==================== ADMIN ONLY ROUTES ====================

    /**
     * POST /api/promos/
     * Create a new promotion
     */
    createPromo(data: CreatePromoRequest): Observable<PromoResponse> {
        return this.http.post<PromoResponse>(`${this.API_URL}/`, data);
    }

    /**
     * PUT /api/promos/:id
     * Update an existing promotion
     */
    updatePromo(id: string, data: UpdatePromoRequest): Observable<PromoResponse> {
        return this.http.put<PromoResponse>(`${this.API_URL}/${id}`, data);
    }

    /**
     * DELETE /api/promos/:id
     * Delete a promotion
     */
    deletePromo(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }

    /**
     * GET /api/promos/admin
     * Get all promotions (Admin view)
     */
    getAllPromosAdmin(): Observable<PromosListResponse> {
        return this.http.get<PromosListResponse>(`${this.API_URL}/admin`);
    }

    /**
     * GET /api/promos/stats
     * Get promotion statistics
     */
    getPromoStats(): Observable<PromoStatsResponse> {
        return this.http.get<PromoStatsResponse>(`${this.API_URL}/stats`);
    }

    // ==================== PUBLIC ROUTES ====================

    /**
     * GET /api/promos/public
     * Get active public promotions
     */
    getPublicPromos(): Observable<PromosListResponse> {
        return this.http.get<PromosListResponse>(`${this.API_URL}/public`);
    }

    // ==================== CART/CHECKOUT ROUTES ====================

    /**
     * POST /api/promos/apply
     * Apply a promotion code to an order amount
     */
    applyPromo(data: ApplyPromoRequest): Observable<ApplyPromoResponse> {
        return this.http.post<ApplyPromoResponse>(`${this.API_URL}/apply`, data);
    }
}
