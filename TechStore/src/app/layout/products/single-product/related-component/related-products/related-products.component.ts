import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Product } from '../../../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-related-products',
  imports: [CommonModule,RouterLink],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css',
})
export class RelatedProductsComponent {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  @Input() products: Product[] = [];


  scrollLeft(): void {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = container.querySelector('.product-card')?.offsetWidth || 0;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = container.querySelector('.product-card')?.offsetWidth || 0;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  viewProduct(product: Product): void {
    console.log('Viewing product:', product);
  }
}
