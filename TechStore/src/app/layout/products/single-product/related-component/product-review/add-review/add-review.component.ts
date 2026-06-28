import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewsService } from '../../../../../../core/services/reviews.service';
import { CreateReviewRequest } from '../../../../../../core/models/review.model';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css'
})
export class AddReviewComponent implements OnInit {
  @Input() productId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  reviewForm: FormGroup;
  isLoading = false;
  error = '';
  stars = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private reviewsService: ReviewsService) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      productCondition: ['New', Validators.required]
    });
  }

  ngOnInit(): void { }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  setCondition(productCondition: string): void {
    this.reviewForm.patchValue({ productCondition });
  }

  onOverlayClick(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.reviewForm.invalid || !this.productId) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const reviewData: CreateReviewRequest = {
      product: this.productId,
      ...this.reviewForm.value
    };

    this.reviewsService.createReview(reviewData).subscribe({
      next: () => {
        this.isLoading = false;
        this.submitted.emit();
        this.close.emit();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.log(err);
        
        this.error = err.error?.message || 'Failed to submit review. Make sure you have purchased this product.';
      }
    });
  }

  get control() {
    return this.reviewForm.controls;
  }
}
