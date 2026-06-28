import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Product,
    CreateProductRequest,
    UpdateProductRequest,
    UpdateStockRequest,
    UpdateVisibilityRequest,
    ProductQueryParams,
    ProductResponse,
    ProductsListResponse,
    SellerStatsResponse,
    Wishlist,
    LowStockResponse
} from '../models/product.model';
import { SellerWithStats } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private readonly API_URL = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    createProduct(data: CreateProductRequest, images?: File[]): Observable<ProductResponse> {
        const formData = this.createProductFormData(data, images);
        return this.http.post<ProductResponse>(`${this.API_URL}/`, formData);
    }

    /**
     * PUT /api/products/:id
     * Update an existing product
     * Requires FormData
     */
    updateProduct(id: string, data: UpdateProductRequest, images?: File[]): Observable<ProductResponse> {
        const formData = this.createProductFormData(data, images);
        return this.http.put<ProductResponse>(`${this.API_URL}/${id}`, formData);
    }

    /**
     * DELETE /api/products/:id
     * Soft delete a product
     */
    deleteProduct(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
    }

    /**
     * DELETE /api/products/:id/image
     * Delete a specific image from a product
     */
    deleteProductImage(id: string, imageIndex: number): Observable<{ message: string }> {
        const params = new HttpParams().set('imageIndex', imageIndex.toString());
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}/image`, { params });
    }

    /**
     * POST /api/products/:id/restore
     * Restore a soft-deleted product
     */
    restoreProduct(id: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.API_URL}/${id}/restore`, {});
    }

    /**
     * PUT /api/products/:id/stock
     * Update product stock quantity
     */
    updateStock(id: string, data: UpdateStockRequest): Observable<{ message: string; stockQuantity: number }> {
        return this.http.put<{ message: string; stockQuantity: number }>(`${this.API_URL}/${id}/stock`, data);
    }

    /**
     * PUT /api/products/:id/visibility
     * Update product visibility status
     */
    updateVisibility(id: string, visibility: 'Published' | 'Draft' | 'Hidden'): Observable<ProductResponse> {
        return this.http.put<ProductResponse>(`${this.API_URL}/${id}/visibility`, { visibility });
    }

    // ==================== ADMIN ONLY ROUTES ====================
    /**
     * GET /api/products/low-stock/admin
     * Get products with low stock (Admin only)
     */
    getLowStockProducts(sellerId?: string): Observable<LowStockResponse> {
        let params = new HttpParams();
        if (sellerId) params = params.set('sellerId', sellerId);

        return this.http.get<LowStockResponse>(`${this.API_URL}/low-stock/admin`, { params });
    }

    getOutOfStockProducts(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(
            `${this.API_URL}/stats/out-of-stock`
        );
    }


    /**
     * PUT /api/products/:id/toggle-featured
     * Toggle product featured status (Admin only)
     */
    toggleFeatured(id: string): Observable<{ message: string; isFeatured: boolean }> {
        return this.http.put<{ message: string; isFeatured: boolean }>(`${this.API_URL}/${id}/toggle-featured`, {});
    }

    // ==================== SELLER ONLY ROUTES ====================

    /**
     * GET /api/products/stats/seller
     * Get dashboard statistics for seller
     */
    getSellerStats(): Observable<SellerStatsResponse> {
        return this.http.get<SellerStatsResponse>(`${this.API_URL}/stats/seller`);
    }

    // ==================== PUBLIC ROUTES ====================

    /**
     * GET /api/products/
     * Get all products with filters
     */
    getAllProducts(queryParams?: ProductQueryParams): Observable<ProductsListResponse> {
        let params = new HttpParams();

        if (queryParams) {
            Object.keys(queryParams).forEach(key => {
                const value = queryParams[key as keyof ProductQueryParams];
                if (value !== undefined && value !== null && value !== 'all' && value !== '') {
                    params = params.set(key, value.toString());
                }
            });
        }

        return this.http.get<ProductsListResponse>(`${this.API_URL}`, { params });
    }

    getSellersStats(): Observable<{ success: boolean; sellers: SellerWithStats[] }> {
        return this.http.get<{ success: boolean; sellers: SellerWithStats[] }>(
            `${this.API_URL}/allStats`
        );
    }


    /**
     * GET /api/products/:id
     * Get single product by ID
     */
    getProductById(id: string): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(`${this.API_URL}/${id}`);
    }

    /**
     * GET /api/products/category/:category
     * Get products by category
     */
    getProductsByCategory(category: string, queryParams?: ProductQueryParams): Observable<ProductsListResponse> {
        let params = new HttpParams();

        if (queryParams) {
            Object.keys(queryParams).forEach(key => {
                const value = queryParams[key as keyof ProductQueryParams];
                if (value !== undefined && value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }

        return this.http.get<ProductsListResponse>(`${this.API_URL}/category/${category}`, { params });
    }

    /**
     * GET /api/products/seller/:sellerId
     * Get products by seller
     */
    getProductsBySeller(sellerId: string, queryParams?: ProductQueryParams): Observable<ProductsListResponse> {
        let params = new HttpParams();

        if (queryParams) {
            Object.keys(queryParams).forEach(key => {
                const value = queryParams[key as keyof ProductQueryParams];
                if (value !== undefined && value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }

        return this.http.get<ProductsListResponse>(`${this.API_URL}/seller/${sellerId}`, { params });
    }

        getSellerStatsById(): Observable<{ success: boolean; stats: SellerStatsResponse }> {
            return this.http.get<{ success: boolean; stats: SellerStatsResponse }>(
                `${this.API_URL}/stats/seller`
            );
        }



    // ==================== HELPER METHODS ====================

    /**
     * Helper to create FormData for product creation/update
     */
    private createProductFormData(data: CreateProductRequest | UpdateProductRequest, images?: File[]): FormData {
        const formData = new FormData();

        // Append simple fields
        Object.keys(data).forEach(key => {
            const value = (data as any)[key];
            if (value !== undefined && value !== null && typeof value !== 'object') {
                formData.append(key, value.toString());
            }
        });

        // Append complex objects as JSON strings
        if (data.technicalSpecs) formData.append('technicalSpecs', JSON.stringify(data.technicalSpecs));
        if (data.dimensions) formData.append('dimensions', JSON.stringify(data.dimensions));
        if (data.weight) formData.append('weight', JSON.stringify(data.weight));
        if (data.warranty) formData.append('warranty', JSON.stringify(data.warranty));

        // Append conditional details
        if (data.condition === 'Used' && data.usedDetails) {
            formData.append('usedDetails', JSON.stringify(data.usedDetails));
        }
        if (data.condition === 'Imported' && data.importedDetails) {
            formData.append('importedDetails', JSON.stringify(data.importedDetails));
        }

        // Append images
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('image', image); // Backend expects 'image' field for multiple files
            });
        }

        return formData;
    }

    ////ADD WISHLIST///
    private readonly wishlist_API = `${environment.apiUrl}/wishlist`;
    addToWishlist(productId: string) {
        return this.http.post(`${this.wishlist_API}/${productId}`, {})
    }
    
    ////remove //
    removeFromWishlist(productId: string) {
        return this.http.delete(`${this.wishlist_API}/${productId}`);
    }
    clearWishlist(){
        return this.http.delete(`${this.wishlist_API}/clear`)
    }

    ///view
    getWishlist(): Observable<Wishlist>{
        return this.http.get<Wishlist>(this.wishlist_API)
    }
}
