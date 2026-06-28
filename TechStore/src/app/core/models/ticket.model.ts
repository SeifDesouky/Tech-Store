// Ticket Models

export interface ContactDetails {
    name: string;
    email: string;
    phone: string;
}

export interface TicketResponse {
    _id: string;
    sender: {
        _id?: string;
        name: string;
        role: 'buyer' | 'seller' | 'admin' | 'support';
    };
    message: string;
    date: string;
}

export interface Ticket {
    _id: string;
    ticketNumber: string;
    user?: string | {
        _id: string;
        name: string;
        email: string;
    };
    subject: string;
    message: string;
    category: 'Order Inquiry' | 'Product Inquiry' | 'Payment Issue' | 'Technical Issue' | 'Return/Refund Request' | 'Other';
    status: 'Open' | 'In Progress' | 'Waiting for Customer Response' | 'Resolved' | 'Closed';
    orderNumber?: string;
    contactDetails: ContactDetails;
    responses: TicketResponse[];
    assignedTo?: string | {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt?: string;
}

// Request DTOs
export interface CreateTicketRequest {
    subject: string;
    message: string;
    category: 'Order Inquiry' | 'Product Inquiry' | 'Payment Issue' | 'Technical Issue' | 'Return/Refund Request' | 'Other';
    orderNumber?: string;
    name: string;
    email: string;
    phone: string;
}

export interface AddResponseRequest {
    message: string;
}

export interface UpdateTicketStatusRequest {
    status?: 'Open' | 'In Progress' | 'Waiting for Customer Response' | 'Resolved' | 'Closed';
    assignedTo?: string;
}

// Response DTOs
export interface TicketCreatedResponse {
    message: string;
    ticket: Ticket;
}

export interface TicketsListResponse {
    tickets: Ticket[];
}

export interface TicketDetailsResponse extends Ticket { }

export interface TicketUpdatedResponse {
    message: string;
    ticket: Ticket;
}

export interface MessageResponse {
    message: string;
}
