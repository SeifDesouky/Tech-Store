import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportsService, CustomerInsights } from '../../../../core/services/admin-reports.service';

@Component({
  selector: 'app-customer-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-insights.component.html',
  styleUrl: './customer-insights.component.css'
})
export class CustomerInsightsComponent implements OnInit {
  insights: CustomerInsights | null = null;
  isLoading = false;
  error: string = '';

  constructor(private reportsService: AdminReportsService) { }

  ngOnInit(): void {
    this.loadCustomerInsights();
  }

  loadCustomerInsights(): void {
    this.isLoading = true;
    this.error = '';

    this.reportsService.getCustomerInsights().subscribe({
      next: (response) => {
        this.insights = response.insights;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading customer insights:', err);
        this.error = 'Failed to load customer insights';
        this.isLoading = false;
      }
    });
  }

  refresh(): void {
    this.loadCustomerInsights();
  }
}
