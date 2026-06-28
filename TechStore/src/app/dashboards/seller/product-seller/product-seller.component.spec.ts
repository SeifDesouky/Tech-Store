import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSellerComponent } from './product-seller.component';

describe('ProductSellerComponent', () => {
  let component: ProductSellerComponent;
  let fixture: ComponentFixture<ProductSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
