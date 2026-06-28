import { Component } from '@angular/core';
import { IReview } from '../../../core/models/review.model';
import { ReviewsService } from '../../../core/services/reviews.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-reviews',
  imports: [FormsModule,CommonModule, TitleCasePipe,DatePipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {
  reviews: IReview[] = []
  selectedReview?: IReview
  formRating = 0
  formText = ''
  approvedCount = 0

  constructor(private reviewService: ReviewsService,private auth:AuthService) { }

  ngOnInit() {
    const userId = this.auth.getCurrentUser()?._id;
    if (!userId) return;
    this.reviewService.getAllReviews({user:userId}).subscribe({
      next: (res: any) => {
        this.reviews = res.reviews || res || [];
        this.countApproved();
      },
      error: (err) => console.error(err)
    });
  }
  openModal(review: IReview) {
    this.selectedReview = { ...review }
    this.formRating = review.rating || 0
    this.formText = review.comment || ''
  }
  submitReview() {
    if (!this.selectedReview) return;
    const updatedReview: IReview = {
      ...this.selectedReview,
      rating: this.formRating,
      comment: this.formText,
      status: 'pending'
    }
    // this.reviewService.updateReview(updatedReview)
    console.warn('Update review not available in service');
  }

  countApproved() {
    if (this.reviews.filter(a => a.status === 'approved')) {
      this.approvedCount += 1
    }

  }
}
