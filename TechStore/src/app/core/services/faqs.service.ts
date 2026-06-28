import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    CreateFAQRequest,
    UpdateFAQRequest,
    FAQQueryParams,
    FAQResponse,
    FAQsListResponse
} from '../models/faq.model';

@Injectable({
    providedIn: 'root'
})
export class FaqsService {
    private readonly API_URL = `${environment.apiUrl}/faq`;

    constructor(private http: HttpClient) { }

    // ==================== PUBLIC ROUTES ====================

    /**
     * GET /api/faq
     * Get all FAQs or filter by category
     */
    getAllFAQs(queryParams?: FAQQueryParams): Observable<FAQsListResponse> {
        let params = new HttpParams();

        if (queryParams && queryParams.category) {
            params = params.set('category', queryParams.category);
        }

        return this.http.get<FAQsListResponse>(`${this.API_URL}`, { params });
    }

    // ==================== ADMIN ONLY ROUTES ====================

    /**
     * POST /api/faq
     * Create a new FAQ entry
     */
    createFAQ(data: CreateFAQRequest): Observable<FAQResponse> {
        return this.http.post<FAQResponse>(`${this.API_URL}`, data);
    }

    /**
     * GET /api/faq/admin/all
     * Get all FAQs (Admin view)
     */
    getAllFAQsAdmin(): Observable<FAQsListResponse> {
        return this.http.get<FAQsListResponse>(`${this.API_URL}/admin/all`);
    }

    /**
     * PUT /api/faq/:id
     * Update an existing FAQ
     */
    updateFAQ(id: string, data: UpdateFAQRequest): Observable<FAQResponse> {
        return this.http.put<FAQResponse>(`${this.API_URL}/${id}`, data);
    }

    /**
     * DELETE /api/faq/:id
     * Delete an FAQ entry
     */
    deleteFAQ(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }
}
