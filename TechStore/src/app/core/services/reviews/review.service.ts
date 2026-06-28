import { Injectable } from '@angular/core';
import { IReview } from '../../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviews: IReview[] = [
    {
      _id: '1',

      user: {
        _id: 'u1',
        name: 'Sara Mohamed',
      },

      product: {
        _id: 'p1',
        name: 'Wireless Noise-Cancelling Headphones',
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      },

      rating: 5,
      comment: 'Absolutely amazing sound quality!',
      status: 'approved',

      productCondition: 'New',
      verifiedPurchase: true,
      helpfulCount: 12,

      createdAt: 'Nov 28, 2024',
    },
    {
      _id: '2',

      user: {
        _id: 'u2',
        name: 'Ahmed Ali',
      },

      product: {
        _id: 'p2',
        name: 'Smart Watch Pro Series 7',
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      },

      rating: 0,
      comment: '',

      status: 'not_reviewed',

      productCondition: 'New',
      verifiedPurchase: true,
      helpfulCount: 0,

      createdAt: 'Nov 25, 2024',
    }

  ];

  getAll(): IReview[] {
    return this.reviews;
  }

  updateReview(updatedReview: IReview) {
    const index = this.reviews.findIndex(r => r._id === updatedReview._id);
    if (index !== -1) {
      this.reviews[index] = updatedReview;
    }
  }
}
