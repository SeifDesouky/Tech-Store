import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportsService, ProductPerformance } from '../../../../core/services/admin-reports.service';

@Component({
  selector: 'app-product-performance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-performance.component.html',
  styleUrl: './product-performance.component.css'
})
export class ProductPerformanceComponent implements OnInit {
  products: ProductPerformance[] = [];
  isLoading = false;
  error: string = '';

  constructor(private reportsService: AdminReportsService) { }

  ngOnInit(): void {
    this.loadProductPerformance();
  }

  loadProductPerformance(): void {
    this.isLoading = true;
    this.error = '';

    this.reportsService.getProductPerformance().subscribe({
      next: (response) => {
        this.products = response.report;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product performance:', err);
        this.error = 'Failed to load product performance data';
        this.isLoading = false;
      }
    });
  }

  refresh(): void {
    this.loadProductPerformance();
  }
}
