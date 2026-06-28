import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    CreateTicketRequest,
    AddResponseRequest,
    UpdateTicketStatusRequest,
    TicketCreatedResponse,
    TicketsListResponse,
    TicketDetailsResponse,
    TicketUpdatedResponse,
    MessageResponse
} from '../models/ticket.model';

@Injectable({
    providedIn: 'root'
})
export class TicketsService {
    private readonly API_URL = `${environment.apiUrl}/tickets`;

    constructor(private http: HttpClient) { }

    // ==================== USER & SUPPORT ROUTES ====================

    /**
     * POST /api/tickets/
     * Create a new support ticket
     */
    createTicket(data: CreateTicketRequest): Observable<TicketCreatedResponse> {
        return this.http.post<TicketCreatedResponse>(`${this.API_URL}/`, data);
    }

    /**
     * GET /api/tickets/
     * Get all tickets (User sees own, Admin/Support sees all)
     */
    getAllTickets(): Observable<TicketsListResponse> {
        return this.http.get<TicketsListResponse>(`${this.API_URL}/`);
    }

    /**
     * GET /api/tickets/:id
     * Get specific ticket details with conversation
     */
    getTicketById(id: string): Observable<TicketDetailsResponse> {
        return this.http.get<TicketDetailsResponse>(`${this.API_URL}/${id}`);
    }

    /**
     * POST /api/tickets/:id/response
     * Add a response message to the ticket (Chat)
     */
    addResponse(id: string, data: AddResponseRequest): Observable<TicketUpdatedResponse> {
        return this.http.post<TicketUpdatedResponse>(`${this.API_URL}/${id}/response`, data);
    }

    /**
     * DELETE /api/tickets/:id
     * Delete a ticket (Admin or Owner)
     */
    deleteTicket(id: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.API_URL}/${id}`);
    }

    // ==================== ADMIN & SUPPORT ONLY ROUTES ====================

    /**
     * PUT /api/tickets/:id
     * Update ticket status or assign agent
     */
    updateTicketStatus(id: string, data: UpdateTicketStatusRequest): Observable<TicketUpdatedResponse> {
        return this.http.put<TicketUpdatedResponse>(`${this.API_URL}/${id}`, data);
    }
}
