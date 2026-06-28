import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import {
  SellerDashboardService,
  DashboardStats,
  RecentOrder,
  TopProduct,
  SalesData
} from '../services/seller-dashboard.service';

@Component({
  selector: 'app-seller-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Performance optimization
})
export class SellerDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Loading states
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // Data properties
  currentDate = new Date();

  // Statistics
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;

  // Recent Orders
  recentOrders: RecentOrder[] = [];

  // Top Products
  topProducts: TopProduct[] = [];

  // Sales data for chart
  salesData: SalesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [0, 0, 0, 0, 0, 0, 0]
  };
  selectedPeriod: 'week' | 'month' | 'year' = 'week';

  constructor(
    private dashboardService: SellerDashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(forceRefresh: boolean = false): void {
    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();

    this.dashboardService.getDashboardData(forceRefresh)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          // Update statistics
          this.totalProducts = data.stats.totalProducts;
          this.totalOrders = data.stats.totalOrders;
          this.totalRevenue = data.stats.totalRevenue;
          this.pendingOrders = data.stats.pendingOrders;

          // Update recent orders
          this.recentOrders = data.recentOrders;

          // Update top products
          this.topProducts = data.topProducts;

          // Load sales data
          this.loadSalesData(this.selectedPeriod);

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load dashboard data. Please try again.';
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Load sales data for chart
   */
  loadSalesData(period: 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;

    this.dashboardService.getSalesData(period)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.salesData = data;
          this.updateChart();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading sales data:', error);
        }
      });
  }

  /**
   * Update chart with new data
   */
  updateChart(): void {
    // Chart is CSS-based, so we just need to update the template
    // The data binding will handle the update
    this.cdr.markForCheck();
  }

  /**
   * Change chart period
   */
  changePeriod(period: 'week' | 'month' | 'year'): void {
    if (this.selectedPeriod !== period) {
      this.loadSalesData(period);
    }
  }

  /**
   * Refresh dashboard data
   */
  refresh(): void {
    this.loadDashboardData(true);
  }

  /**
   * Get percentage for chart bar height
   */
  getBarHeight(value: number): string {
    if (!this.salesData.values.length) return '0%';

    const maxValue = Math.max(...this.salesData.values);
    if (maxValue === 0) return '0%';

    const percentage = (value / maxValue) * 100;
    return `${Math.max(percentage, 5)}%`; // Minimum 5% for visibility
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number): string {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  }

  /**
   * Track by function for ngFor performance
   */
  trackByOrderId(index: number, order: RecentOrder): string {
    return order.id;
  }

  /**
   * Track by function for products
   */
  trackByProductName(index: number, product: TopProduct): string {
    return product.name;
  }

  /**
   * Track by function for chart bars
   */
  trackByIndex(index: number): number {
    return index;
  }
}
