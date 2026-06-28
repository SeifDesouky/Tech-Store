import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    UpdateUserRequest,
    UsersListResponse,
    UserResponse,
    ToggleBanResponse,
    MessageResponse,
    Address,
    ToggleActiveResponse,
    User,
    SellerWithStats
} from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly API_URL = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    // ==================== PROTECTED ENDPOINTS (Require Bearer Token) ====================

    /**
     * GET /api/users/
     * Get all users (Admin only)
     */
    getAllUsers(): Observable<UsersListResponse> {
        return this.http.get<UsersListResponse>(`${this.API_URL}/`);
    }
    getSellers(): Observable<{ success: boolean; users: User[] }> {
        return this.http.get<{ success: boolean; users: User[] }>(
            `${this.API_URL}?role=seller`
        );
    }



    /**
     * GET /api/users/:id
     * Get user by ID
     */
    getUserById(id: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.API_URL}/${id}`);
    }

    /**
     * PUT /api/users/user/:id
     * Update any user (Admin only)
     * For file upload: Use FormData with field 'profilePicture'
     */
    updateUser(id: string, data: UpdateUserRequest | FormData): Observable<UserResponse> {
        return this.http.put<UserResponse>(`${this.API_URL}/user/${id}`, data);
    }
    updateSellerStatus(id: string, action: 'approve' | 'reject'): Observable<any> {
        return this.http.put(`${this.API_URL}/${id}/status`, { action });
    }
    approveSeller(userId: string,status:string) {
  return this.http.put(
    `${this.API_URL}/${userId}/review`,
    { status: status }
  );
}

    /**
     * PUT /api/users/profile
     * Update current user's profile
     * For file upload: Use FormData with field 'profilePicture'
     */
    updateProfile(data: UpdateUserRequest | FormData): Observable<UserResponse> {
        return this.http.put<UserResponse>(`${this.API_URL}/profile`, data);
    }

    /**
     * PUT /api/users/:id/toggle-ban
     * Toggle user ban status (Admin only)
     */
    toggleUserBan(id: string): Observable<ToggleBanResponse> {
        return this.http.put<ToggleBanResponse>(`${this.API_URL}/${id}/toggle-ban`, {});
    }
    toggleUserActive(id:string):Observable<ToggleActiveResponse>{
        return this.http.put<ToggleActiveResponse>(`${this.API_URL}/${id}/toggle-active`, {})
    }

    /**
     * DELETE /api/users/:id
     * Delete user (Admin only)
     */
    deleteUser(id: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.API_URL}/${id}`);
    }

    // ==================== ADDRESS ENDPOINTS ====================

    /**
     * POST /api/users/address
     * Add a new address to current user
     */
    addAddress(address: Address): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/address`, address);
    }

    /**
     * PUT /api/users/address/:addressId
     * Update an existing address
     */
    updateAddress(addressId: string, address: Partial<Address>): Observable<any> {
        return this.http.put<any>(`${this.API_URL}/address/${addressId}`, address);
    }

    /**
     * DELETE /api/users/address/:addressId
     * Delete an address
     */
    deleteAddress(addressId: string): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/address/${addressId}`);
    }

    /**
     * GET /api/users/address
     * Get all saved addresses for current user
     */
    getAddresses(): Observable<{ addresses: Address[], count: number, defaultAddress?: Address }> {
        return this.http.get<{ addresses: Address[], count: number, defaultAddress?: Address }>(`${this.API_URL}/addresses`);
    }
    getAllGovernorates(): Observable<{ _id: string; name: string }[]> {
    return this.http.get<{ _id: string; name: string }[]>(`${this.API_URL}/address/governorates`);
    }
    
 


    // ==================== HELPER METHODS ====================

    /**
     * Create FormData for profile update with file upload
     * @param data User data
     * @param profilePicture File to upload
     */
    createProfileFormData(data: UpdateUserRequest, profilePicture?: File): FormData {
        const formData = new FormData();

        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        // Append other fields
        if (data.name) formData.append('name', data.name);
        if (data.email) formData.append('email', data.email);
        if (data.phone) formData.append('phone', data.phone);

        if (data.addresses) {
            formData.append('addresses', JSON.stringify(data.addresses));
        }

        if (data.notificationPreferences) {
            formData.append('notificationPreferences', JSON.stringify(data.notificationPreferences));
        }

        return formData;
    }
}
