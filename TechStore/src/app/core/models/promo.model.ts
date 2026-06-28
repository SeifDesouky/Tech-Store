
export interface Promo {
    _id: string;
    code: string;
    type: 'Percentage' | 'Fixed' | 'FreeShipping' | 'BuyXGetY';
    value: number;
    minPurchase: number;
    startDate: string;
    endDate: string;
    usageLimitPerUser: number;
    totalUsageLimit: number;
    active: boolean;
    usedCount?: number;
    createdAt?: string;
    updatedAt?: string;
}
export interface CreatePromoRequest {
    code: string;
    type: 'Percentage' | 'Fixed' | 'FreeShipping' | 'BuyXGetY';
    value: number;
    minPurchase: number;
    startDate: string;
    endDate: string;
    usageLimitPerUser: number;
    totalUsageLimit: number;
}

export interface UpdatePromoRequest extends Partial<CreatePromoRequest> {
    active?: boolean;
}

export interface ApplyPromoRequest {
    code: string;
    totalAmount: number;
}

export interface PromoResponse {
    success: boolean;
    message: string;
    promo: Promo;
}

export interface PromosListResponse {
    success: boolean;
    promos: Promo[];
}

export interface ApplyPromoResponse {
    success: boolean;
    message: string;
    discount: number;
    finalAmount: number;
    promo: Promo;
}

export interface PromoStatsResponse {
    totalPromos: number;
    activePromos: number;
    expiredPromos: number;
    totalUsage: number;
    totalDiscountGiven: number;
}
