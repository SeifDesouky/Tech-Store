import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TicketsService } from '../../../../core/services/tickets.service';

export interface Ticket {
  ticketNumber: string;
  status: 'In Progress' | 'Open' | 'Closed';
  issueTitle: string;
  messageCount: number;
  createdAt: Date;
  lastUpdated: Date;
}
@Component({
  selector: 'app-my-ticket',
  imports: [DatePipe, CommonModule],
  templateUrl: './my-ticket.component.html',
  styleUrl: './my-ticket.component.css',
})
export class MyTicketComponent {
  tickets: Ticket[] = [];

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketsService.getAllTickets().subscribe({
      next: (res: any) => {
        const rawTickets = res.tickets || res || [];
        this.tickets = rawTickets.map((t: any) => ({
          ticketNumber: t._id.substring(0, 8).toUpperCase(), // Mock ticket number from ID
          status: t.status === 'open' ? 'Open' : (t.status === 'closed' ? 'Closed' : 'In Progress'),
          issueTitle: t.subject,
          messageCount: t.responses ? t.responses.length : 0,
          createdAt: new Date(t.createdAt),
          lastUpdated: new Date(t.updatedAt || t.createdAt)
        }));
        this.sortTicketsByLastUpdated();
      },
      error: (err) => console.error(err)
    });
  }

  sortTicketsByLastUpdated(): void {
    this.tickets.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'In Progress':
        return 'badge bg-warning text-dark';
      case 'Open':
        return 'badge bg-primary';
      case 'Closed':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }
}
