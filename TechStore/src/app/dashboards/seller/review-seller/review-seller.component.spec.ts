import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSellerComponent } from './review-seller.component';

describe('ReviewSellerComponent', () => {
  let component: ReviewSellerComponent;
  let fixture: ComponentFixture<ReviewSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
