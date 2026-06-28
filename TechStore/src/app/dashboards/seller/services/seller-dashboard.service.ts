import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, BehaviorSubject, ReplaySubject, timer } from 'rxjs';
import { map, catchError, shareReplay, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductsService } from '../../../core/services/products.service';
import { OrdersService, SellerOrderStats, SellerOrdersResponse } from '../../../core/services/orders.service';
import { SellerStatsResponse } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    totalStock: number;
    totalSold: number;
    averageRating: number;
    lowStockCount: number;
}

export interface RecentOrder {
    id: string;
    customerName: string;
    productName: string;
    date: Date;
    amount: number;
    status: string;
}

export interface TopProduct {
    name: string;
    category: string;
    image: string;
    sales: number;
    revenue: number;
}

export interface SalesData {
    labels: string[];
    values: number[];
}

@Injectable({
    providedIn: 'root'
})
export class SellerDashboardService {
    // Enhanced caching with BehaviorSubject for synchronous value access
    private statsCache$ = new BehaviorSubject<DashboardStats | null>(null);
    private ordersCache$ = new BehaviorSubject<RecentOrder[] | null>(null);
    private topProductsCache$ = new BehaviorSubject<TopProduct[] | null>(null);
    private salesDataCache$ = new Map<string, { data: SalesData; timestamp: number }>();

    // Cache expiration time (5 minutes)
    private readonly CACHE_DURATION = 5 * 60 * 1000;
    private lastFetchTime: number = 0;

    // Request deduplication - prevent multiple simultaneous requests
    private pendingRequest$: Observable<any> | null = null;

    // Memoization cache for processed data
    private memoCache = new Map<string, { data: any; timestamp: number }>();

    constructor(
        private productsService: ProductsService,
        private ordersService: OrdersService
    ) { }

    /**
     * Get all dashboard data with caching and request deduplication
     */
    getDashboardData(forceRefresh: boolean = false): Observable<{
        stats: DashboardStats;
        recentOrders: RecentOrder[];
        topProducts: TopProduct[];
    }> {
        const now = Date.now();
        const isCacheValid = !forceRefresh && (now - this.lastFetchTime) < this.CACHE_DURATION;

        // Return cached data if valid
        if (isCacheValid && this.statsCache$.value && this.ordersCache$.value && this.topProductsCache$.value) {
            return of({
                stats: this.statsCache$.value,
                recentOrders: this.ordersCache$.value,
                topProducts: this.topProductsCache$.value
            });
        }

        // Request deduplication: if a request is already pending, return it
        if (this.pendingRequest$ && !forceRefresh) {
            return this.pendingRequest$;
        }

        // Fetch fresh data
        this.pendingRequest$ = forkJoin({
            productStats: this.productsService.getSellerStats(),
            orderData: this.ordersService.getSellerOrders({})
        }).pipe(
            map(({ productStats, orderData }) => {
                // Combine stats
                const stats: DashboardStats = {
                    totalProducts: productStats.totalProducts || 0,
                    totalOrders: orderData.stats.totalOrders || 0,
                    totalRevenue: orderData.stats.totalRevenue || 0,
                    pendingOrders: orderData.stats.pendingOrders || 0,
                    totalStock: productStats.totalStock || 0,
                    totalSold: productStats.totalSold || 0,
                    averageRating: productStats.averageRating || 0,
                    lowStockCount: productStats.lowStockCount || 0
                };

                // Process recent orders with memoization
                const recentOrders = this.processRecentOrders(orderData.orders);

                // Process top products with memoization
                const topProducts = this.processTopProducts(orderData.orders);

                // Update cache
                this.statsCache$.next(stats);
                this.ordersCache$.next(recentOrders);
                this.topProductsCache$.next(topProducts);
                this.lastFetchTime = now;

                return {
                    stats,
                    recentOrders,
                    topProducts
                };
            }),
            catchError(error => {
                console.error('Error fetching dashboard data:', error);
                // Return cached data or empty data
                return of({
                    stats: this.statsCache$.value || this.getEmptyStats(),
                    recentOrders: this.ordersCache$.value || [],
                    topProducts: this.topProductsCache$.value || []
                });
            }),
            tap(() => {
                // Clear pending request after completion
                this.pendingRequest$ = null;
            }),
            shareReplay({ bufferSize: 1, refCount: true }) // Share the result among multiple subscribers
        );

        return this.pendingRequest$;
    }

    /**
     * Get only statistics (lightweight call)
     */
    getStats(forceRefresh: boolean = false): Observable<DashboardStats> {
        const now = Date.now();
        const isCacheValid = !forceRefresh && (now - this.lastFetchTime) < this.CACHE_DURATION;

        if (isCacheValid && this.statsCache$.value) {
            return of(this.statsCache$.value);
        }

        return forkJoin({
            productStats: this.productsService.getSellerStats(),
            orderData: this.ordersService.getSellerOrders({})
        }).pipe(
            map(({ productStats, orderData }) => {
                const stats: DashboardStats = {
                    totalProducts: productStats.totalProducts || 0,
                    totalOrders: orderData.stats.totalOrders || 0,
                    totalRevenue: orderData.stats.totalRevenue || 0,
                    pendingOrders: orderData.stats.pendingOrders || 0,
                    totalStock: productStats.totalStock || 0,
                    totalSold: productStats.totalSold || 0,
                    averageRating: productStats.averageRating || 0,
                    lowStockCount: productStats.lowStockCount || 0
                };

                this.statsCache$.next(stats);
                return stats;
            }),
            catchError(error => {
                console.error('Error fetching stats:', error);
                return of(this.statsCache$.value || this.getEmptyStats());
            })
        );
    }

    /**
     * Get recent orders
     */
    getRecentOrders(limit: number = 5): Observable<RecentOrder[]> {
        return this.ordersService.getSellerOrders({}).pipe(
            map(response => this.processRecentOrders(response.orders, limit)),
            catchError(error => {
                console.error('Error fetching recent orders:', error);
                return of([]);
            })
        );
    }

    /**
     * Get sales data for chart with caching
     */
    getSalesData(period: 'week' | 'month' | 'year' = 'week'): Observable<SalesData> {
        const cacheKey = period;
        const cached = this.salesDataCache$.get(cacheKey);
        const now = Date.now();

        // Return cached data if valid
        if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
            return of(cached.data);
        }

        return this.ordersService.getSellerOrders({}).pipe(
            map(response => {
                const salesData = this.processSalesData(response.orders, period);
                // Cache the result
                this.salesDataCache$.set(cacheKey, { data: salesData, timestamp: now });
                return salesData;
            }),
            catchError(error => {
                console.error('Error fetching sales data:', error);
                // Return cached data if available, otherwise empty data
                return of(cached?.data || this.getEmptySalesData(period));
            })
        );
    }

    /**
     * Clear all caches (call this when data is updated)
     */
    clearCache(): void {
        this.statsCache$.next(null);
        this.ordersCache$.next(null);
        this.topProductsCache$.next(null);
        this.salesDataCache$.clear();
        this.memoCache.clear();
        this.lastFetchTime = 0;
        this.pendingRequest$ = null;
    }

    /**
     * Process orders into recent orders format
     */
    private processRecentOrders(orders: any[], limit: number = 5): RecentOrder[] {
        if (!orders || orders.length === 0) return [];

        return orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
            .map(order => ({
                id: order.orderNumber || order._id,
                customerName: typeof order.user === 'object' ? order.user.name : 'Customer',
                productName: this.getFirstProductName(order.items),
                date: new Date(order.createdAt),
                amount: order.totalAmount || 0,
                status: order.orderStatus || 'Pending'
            }));
    }

    /**
     * Process orders to find top products
     */
    private processTopProducts(orders: any[]): TopProduct[] {
        if (!orders || orders.length === 0) return [];

        // Aggregate product sales
        const productMap = new Map<string, {
            name: string;
            category: string;
            image: string;
            sales: number;
            revenue: number;
        }>();

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach((item: any) => {
                    const product = typeof item.product === 'object' ? item.product : null;
                    if (product) {
                        const key = product._id;
                        const existing = productMap.get(key);

                        if (existing) {
                            existing.sales += item.quantity;
                            existing.revenue += (item.price || product.price) * item.quantity;
                        } else {
                            productMap.set(key, {
                                name: product.name,
                                category: product.category || 'General',
                                image: product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
                                sales: item.quantity,
                                revenue: (item.price || product.price) * item.quantity
                            });
                        }
                    }
                });
            }
        });

        // Convert to array and sort by sales
        return Array.from(productMap.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
    }

    /**
     * Process sales data for charts
     */
    private processSalesData(orders: any[], period: 'week' | 'month' | 'year'): SalesData {
        const now = new Date();
        const salesMap = new Map<string, number>();

        if (period === 'week') {
            // Last 7 days
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dayName = days[date.getDay()];
                salesMap.set(dayName, 0);
            }

            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays < 7) {
                    const dayName = days[orderDate.getDay()];
                    salesMap.set(dayName, (salesMap.get(dayName) || 0) + order.totalAmount);
                }
            });
        } else if (period === 'month') {
            // Last 30 days grouped by week
            for (let i = 0; i < 4; i++) {
                salesMap.set(`Week ${i + 1}`, 0);
            }

            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays < 30) {
                    const weekIndex = Math.floor(diffDays / 7);
                    const weekKey = `Week ${4 - weekIndex}`;
                    salesMap.set(weekKey, (salesMap.get(weekKey) || 0) + order.totalAmount);
                }
            });
        } else {
            // Last 12 months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - i);
                salesMap.set(months[date.getMonth()], 0);
            }

            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const monthName = months[orderDate.getMonth()];
                if (salesMap.has(monthName)) {
                    salesMap.set(monthName, (salesMap.get(monthName) || 0) + order.totalAmount);
                }
            });
        }

        return {
            labels: Array.from(salesMap.keys()),
            values: Array.from(salesMap.values())
        };
    }

    /**
     * Get first product name from order items
     */
    private getFirstProductName(items: any[]): string {
        if (!items || items.length === 0) return 'Product';

        const firstItem = items[0];
        const product = typeof firstItem.product === 'object' ? firstItem.product : null;

        if (product && product.name) {
            return items.length > 1 ? `${product.name} +${items.length - 1} more` : product.name;
        }

        return 'Product';
    }

    /**
     * Get empty stats object
     */
    private getEmptyStats(): DashboardStats {
        return {
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            totalStock: 0,
            totalSold: 0,
            averageRating: 0,
            lowStockCount: 0
        };
    }

    /**
     * Get empty sales data
     */
    private getEmptySalesData(period: 'week' | 'month' | 'year'): SalesData {
        if (period === 'week') {
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                values: [0, 0, 0, 0, 0, 0, 0]
            };
        } else if (period === 'month') {
            return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                values: [0, 0, 0, 0]
            };
        } else {
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };
        }
    }
}
