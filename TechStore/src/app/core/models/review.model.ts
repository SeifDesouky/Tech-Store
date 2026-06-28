// Review Models

export interface IReview {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    product: {
        _id: string;
        name: string;
        img:string
    };
    rating: number;
    status: 'pending' | 'approved' | 'rejected'|'not_reviewed'
    comment: string;
    productCondition: 'New' | 'Used' | 'Imported';
    verifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt?: string;
}

// Request DTOs
export interface CreateReviewRequest {
    product: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    productCondition: 'New' | 'Used' | 'Imported';
}

// Query Parameters
export interface ReviewQueryParams {
    product?: string;
    user?:string
    rating?: 1 | 2 | 3 | 4 | 5;
    condition?: 'New' | 'Used' | 'Imported';
    verified?: boolean;
    sort?: 'highest' | 'lowest' | 'helpful' | 'newest';
}

// Response DTOs
export interface ReviewResponse {
    message: string;
    review: IReview;
}

export interface ReviewsListResponse {
    count: number;
    reviews: IReview[];
}

export interface HelpfulResponse {
    message: string;
    helpfulCount: number;
}
