import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ==================== INTERFACES ====================

export interface DashboardMetrics {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    pendingOrdersCount: number;
    newCustomerRegistrations: number;
    lowStockAlerts: number;
    revenueTrends: {
        daily: number;
        weekly: number;
        monthly: number;
    };
}

export interface DashboardResponse {
    success: boolean;
    dashboard: DashboardMetrics;
}

export interface SalesReportParams {
    dateFrom?: string;
    dateTo?: string;
    exportFormat?: 'csv' | 'pdf';
}

export interface ProductPerformance {
    ProductName: string;
    TotalRevenue: number;
    TotalPurchases: number;
    ViewsCount: string;
    PurchaseConversionRate: string;
}

export interface ProductPerformanceResponse {
    success: boolean;
    report: ProductPerformance[];
}

export interface TopCustomer {
    CustomerName: string;
    CustomerEmail: string;
    TotalSpent: number;
    TotalOrders: number;
}

export interface CustomerInsights {
    topCustomers: TopCustomer[];
    retentionRate: string;
    averageCLV: string;
}

export interface CustomerInsightsResponse {
    success: boolean;
    insights: CustomerInsights;
}

// ==================== SERVICE ====================

@Injectable({
    providedIn: 'root'
})
export class AdminReportsService {
    private readonly API_URL = `${environment.apiUrl}/stats`;

    constructor(private http: HttpClient) { }

    /**
     * Get dashboard metrics
     */
    getDashboardMetrics(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(`${this.API_URL}/metrics`);
    }

    /**
     * Get sales report (JSON)
     */
    getSalesReport(params?: SalesReportParams): Observable<any> {
        let httpParams = new HttpParams();

        if (params?.dateFrom) {
            httpParams = httpParams.set('dateFrom', params.dateFrom);
        }
        if (params?.dateTo) {
            httpParams = httpParams.set('dateTo', params.dateTo);
        }

        return this.http.get(`${this.API_URL}/reports/sales`, { params: httpParams });
    }

    /**
     * Download sales report as CSV
     */
    downloadSalesCSV(params?: SalesReportParams): Observable<Blob> {
        let httpParams = new HttpParams();

        if (params?.dateFrom) {
            httpParams = httpParams.set('dateFrom', params.dateFrom);
        }
        if (params?.dateTo) {
            httpParams = httpParams.set('dateTo', params.dateTo);
        }
        httpParams = httpParams.set('exportFormat', 'csv');

        return this.http.get(`${this.API_URL}/reports/sales`, {
            params: httpParams,
            responseType: 'blob'
        });
    }

    /**
     * Download sales report as PDF
     */
    downloadSalesPDF(params?: SalesReportParams): Observable<Blob> {
        let httpParams = new HttpParams();

        if (params?.dateFrom) {
            httpParams = httpParams.set('dateFrom', params.dateFrom);
        }
        if (params?.dateTo) {
            httpParams = httpParams.set('dateTo', params.dateTo);
        }
        httpParams = httpParams.set('exportFormat', 'pdf');

        return this.http.get(`${this.API_URL}/reports/sales`, {
            params: httpParams,
            responseType: 'blob'
        });
    }

    /**
     * Get product performance report
     */
    getProductPerformance(): Observable<ProductPerformanceResponse> {
        return this.http.get<ProductPerformanceResponse>(`${this.API_URL}/reports/products/performance`);
    }

    /**
     * Get customer insights
     */
    getCustomerInsights(): Observable<CustomerInsightsResponse> {
        return this.http.get<CustomerInsightsResponse>(`${this.API_URL}/insights/customers`);
    }

    /**
     * Helper method to download blob as file
     */
    downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
