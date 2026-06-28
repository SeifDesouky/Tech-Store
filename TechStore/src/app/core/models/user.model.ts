// User Models
export interface Governorate {
  _id: string;
  name: string;
}
export interface Address {
    _id?: string;
    label: string;
    street: string;
    city: string;
    governorate: Governorate;
    zipCode: string;
    isDefault: boolean;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'buyer' | 'seller' | 'admin';
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    twoFactorEnabled: boolean;
    twoFactorMethod: string;
    twoFactorRecoveryCodes: string[];
    isBanned: boolean;
    accountStatus: 'pending' | 'approved' | 'rejected';
    addresses: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    orderCount?: number;
}
export interface SellerWithStats extends User {
    productsCount?: number;
    revenue?: number;
}
export interface UserFilters {
    searchTerm: string;
    roleFilter: string;
    statusFilter: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'buyer' | 'seller';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SocialLoginRequest {
    email: string;
    googleId?: string;
    facebookId?: string;
    name: string;
    profilePicture?: string;
}

export interface Verify2FARequest {
    userId: string;
    code: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    phone?: string;
    addresses?: Address[];
    notificationPreferences?: NotificationPreferences;
}

// Response DTOs
export interface RegisterResponse {
    message: string;
    userId: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export interface UsersListResponse {
    users: User[];
}

export interface UserResponse {
    user: User;
}

export interface ToggleBanResponse {
    message: string;
    isBanned: boolean;
}

export interface ToggleActiveResponse {
    message: string;
    isEmailVerified: boolean;
}
export interface MessageResponse {
    message: string;
}
