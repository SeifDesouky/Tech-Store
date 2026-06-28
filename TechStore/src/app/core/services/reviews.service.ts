import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    CreateReviewRequest,
    ReviewQueryParams,
    ReviewResponse,
    ReviewsListResponse,
    HelpfulResponse
} from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewsService {
    private readonly API_URL = `${environment.apiUrl}/reviews`;

    constructor(private http: HttpClient) { }

    // ==================== PUBLIC ROUTES ====================

    /**
     * GET /api/reviews/
     * Get all reviews with optional filters (all for admin) (products for user)
     */
    getAllReviews(queryParams?: ReviewQueryParams): Observable<ReviewsListResponse> {
        let params = new HttpParams();

        if (queryParams) {
            Object.keys(queryParams).forEach(key => {
                const value = queryParams[key as keyof ReviewQueryParams];
                if (value !== undefined && value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }

        return this.http.get<ReviewsListResponse>(`${this.API_URL}/`, { params });
    }

    // ==================== AUTHENTICATED ROUTES ====================

    /**
     * POST /api/reviews/
     * Create a new review (Buyer only)
     * Prerequisite: Must have purchased and received the product
     */
    createReview(data: CreateReviewRequest): Observable<ReviewResponse> {
        return this.http.post<ReviewResponse>(`${this.API_URL}/`, data);
    }

    /**
     * PUT /api/reviews/:id/helpful
     * Mark a review as helpful
     */
    markAsHelpful(id: string): Observable<HelpfulResponse> {
        return this.http.put<HelpfulResponse>(`${this.API_URL}/${id}/helpful`, {});
    }
    
    /**
     * DELETE /api/reviews/:id
     * Delete a review (Admin or Review Owner)
     */
    deleteReview(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }
}
