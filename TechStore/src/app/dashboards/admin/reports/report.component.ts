import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminReportsService, DashboardMetrics } from '../../../core/services/admin-reports.service';

@Component({
    selector: 'app-report',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './report.component.html',
    styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
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
