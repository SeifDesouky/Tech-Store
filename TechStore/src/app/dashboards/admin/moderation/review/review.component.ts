import { Component } from '@angular/core';
import { IReview } from '../../../../core/models/review.model';
import { ReviewsService } from '../../../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {
  reviews: IReview[] = [];
  totalReviews:number=0
  isLoading = false;

  constructor(private reviewService: ReviewsService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews = res.reviews;
        this.totalReviews=this.reviews.length
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reviews', err);
        this.isLoading = false;
      }
    });
  }
  deleteReview(reviewId:string){
    this.reviewService.deleteReview(reviewId).subscribe({
      next:(res)=>{
        console.log('review deleted '); 
        this.loadReviews() 
      },
      error:(err)=>console.log('error in delete',err)
      
    })
  }

}
