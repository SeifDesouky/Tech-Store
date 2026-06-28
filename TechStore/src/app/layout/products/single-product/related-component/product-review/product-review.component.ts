import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IReview } from '../../../../../core/models/review.model';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css',
})
export class ProductReviewComponent {
  @ViewChild('smallReviewsContainer') smallReviewsContainer!: ElementRef;
  @Input() reviews: IReview[] = [];
  totalReviews = 24;

  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  scrollLeft(): void {
    const container = this.smallReviewsContainer.nativeElement;
    const cardWidth = container.querySelector('.small-review-card')?.offsetWidth || 0;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    const container = this.smallReviewsContainer.nativeElement;
    const cardWidth = container.querySelector('.small-review-card')?.offsetWidth || 0;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}
