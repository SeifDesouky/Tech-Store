import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminReportsService } from '../../../../core/services/admin-reports.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css'
})
export class SalesReportComponent {
  dateFrom: string = '';
  dateTo: string = '';
  salesData: any[] = [];
  isLoading = false;
  isDownloading = false;
  error: string = '';

  constructor(private reportsService: AdminReportsService) { }

  /**
   * Load sales report as JSON
   */
  loadSalesReport(): void {
    this.isLoading = true;
    this.error = '';

    const params = {
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined
    };

    this.reportsService.getSalesReport(params).subscribe({
      next: (response: any) => {
        this.salesData = response?.report || [];
        this.isLoading = false;
        console.log(response);
      },
      error: (err) => {
        console.error('Error loading sales report:', err);
        this.error = 'Failed to load sales report';
        this.isLoading = false;
      }
    });
  }

  /**
   * Download sales report as CSV
   */
  downloadCSV(): void {
    this.isDownloading = true;
    this.error = '';

    const params = {
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined
    };

    this.reportsService.downloadSalesCSV(params).subscribe({
      next: (blob) => {
        const filename = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
        this.reportsService.downloadFile(blob, filename);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Error downloading CSV:', err);
        this.error = 'Failed to download CSV';
        this.isDownloading = false;
      }
    });
  }

  /**
   * Download sales report as PDF
   */
  downloadPDF(): void {
    this.isDownloading = true;
    this.error = '';

    const params = {
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined
    };

    this.reportsService.downloadSalesPDF(params).subscribe({
      next: (blob) => {
        const filename = `sales-report-${new Date().toISOString().split('T')[0]}.pdf`;
        this.reportsService.downloadFile(blob, filename);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Error downloading PDF:', err);
        this.error = 'Failed to download PDF';
        this.isDownloading = false;
      }
    });
  }

  /**
   * Clear filters
   */
  clearFilters(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.salesData = [];
    this.error = '';
  }
}
