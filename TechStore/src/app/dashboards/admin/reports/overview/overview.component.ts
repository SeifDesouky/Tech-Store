import { Component } from '@angular/core';
import { AdminReportsService, DashboardMetrics } from '../../../../core/services/admin-reports.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
dashboard: DashboardMetrics | null = null;
    isLoading = false;
    error: string = '';

    constructor(private reportsService: AdminReportsService) { }
  ngOnInit(): void {
        this.loadDashboardMetrics();
    }

    loadDashboardMetrics(): void {
        this.isLoading = true;
        this.error = '';

        this.reportsService.getDashboardMetrics().subscribe({
            next: (response) => {
                this.dashboard = response.dashboard;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading dashboard metrics:', err);
                this.error = 'Failed to load dashboard metrics';
                this.isLoading = false;
            }
        });
    }

    refresh(): void {
        this.loadDashboardMetrics();
    }
}
