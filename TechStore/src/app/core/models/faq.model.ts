// FAQ Models

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: 'Returns and Refunds' | 'Payment Methods' | 'Shipping' | 'Account' | 'Products' | 'Technical' | 'Other';
    createdAt?: string;
    updatedAt?: string;
}

// Request DTOs
export interface CreateFAQRequest {
    question: string;
    answer: string;
    category: 'Returns and Refunds' | 'Payment Methods' | 'Shipping' | 'Account' | 'Products' | 'Technical' | 'Other';
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> { }

// Query Parameters
export interface FAQQueryParams {
    category?: string;
}

// Response DTOs
export interface FAQResponse {
    success: boolean;
    message: string;
    faq: FAQ;
}

export interface FAQsListResponse {
    success: boolean;
    faqs: FAQ[];
}
