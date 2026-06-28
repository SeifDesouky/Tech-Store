import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSpecsComponent } from "./related-component/product-specs/product-specs.component";
import { RelatedProductsComponent } from "./related-component/related-products/related-products.component";
import { ProductReviewComponent } from "./related-component/product-review/product-review.component";
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { IReview } from '../../../core/models/review.model';
import { ReviewsService } from '../../../core/services';
import { AuthService } from '../../../core/services/auth/auth.service';
import { GuestCartService } from '../../../core/services/guest-cart.service';
@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule, ProductSpecsComponent, RelatedProductsComponent, ProductReviewComponent],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css',
})
export class SingleProductComponent {

  product: any = null;
  similarProduct: Product[] = []
  selectedImage: string = '';
  activeTab: string = 'specs';
  isLoading = false;
  reviews: IReview[] = []

  constructor(
    private productService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private SReview: ReviewsService,
    private authService: AuthService,
    private guestCartService: GuestCartService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        // Map backend product to UI structure
        const p = res.product || res;
        this.product = {
          ...p,
          technicalSpecs: p.technicalSpecs || {},
          dimensions: p.dimensions || {},
          weight: p.weight || {},
          usedDetails: p.usedDetails || {},
          importedDetails: p.importedDetails || {}
        };
        this.selectedImage = this.product.images?.[0];
        this.loadReviews(id)
        this.isLoading = false;
        this.similarProduct = res.similar || []
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadReviews(productId: string) {
    this.SReview.getAllReviews({ product: productId }).subscribe(res => {
      this.reviews = res.reviews
    })
    console.log(productId);

    console.log(this.reviews);
  }

  selectThumbnail(image: string) {
    this.selectedImage = image;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  addToCart() {
    if (!this.product) return;

    const productId = this.product.id || this.product._id;

    // Check if user is authenticated
    if (this.authService.isLoggedIn()) {
      // Add to backend cart for authenticated users
      this.cartService.addToCart(productId).subscribe({
        next: (res) => {
          console.log('Added to cart', res);
          alert('Product added to cart');
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Failed to add to cart', err);
          alert('Failed to add to cart');
        }
      });
    } else {
      // Add to guest cart in localStorage
      this.guestCartService.addToGuestCart(productId, 1);
      alert('Product added to cart');
      this.router.navigate(['/cart']);
    }
  }

  buyNow() {
    if (!this.product) return;

    const productId = this.product.id || this.product._id;

    // Check if user is authenticated
    if (this.authService.isLoggedIn()) {
      // Add to backend cart and navigate to payment
      this.cartService.addToCart(productId).subscribe({
        next: (res) => {
          console.log('Added to cart', res);
          this.router.navigate(['/payment']);
        },
        error: (err) => {
          console.error('Failed to add to cart', err);
          alert('Failed to add to cart before checkout');
        }
      });
    } else {
      // Add to guest cart and navigate to cart (will prompt login at checkout)
      this.guestCartService.addToGuestCart(productId, 1);
      this.router.navigate(['/cart']);
    }
  }

  getRatingStars() {
    if (!this.product) return { full: 0, half: false, empty: 5 };
    const rating = this.product.rating || 0;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return { full, half, empty };
  }
}
