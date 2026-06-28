import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketsService } from '../../../../core/services/tickets.service';

@Component({
  selector: 'app-support-ticket',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './support-ticket.component.html',
  styleUrl: './support-ticket.component.css',
})
export class SupportTicketComponent {
  ticketForm!: FormGroup;
  submitted = false;
  isLoading = false;

  issueTypes = [
    { value: '', label: 'Select an issue type' },
    { value: 'order-issue', label: 'Order Issue' },
    { value: 'payment-problem', label: 'Payment Problem' },
    { value: 'shipping-delay', label: 'Shipping Delay' },
    { value: 'product-defect', label: 'Product Defect' },
    { value: 'refund-request', label: 'Refund Request' },
    { value: 'account-issue', label: 'Account Issue' },
    { value: 'technical-support', label: 'Technical Support' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private ticketsService: TicketsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ticketForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      issueType: ['', Validators.required],
      orderNumber: [''],
      message: ['', Validators.required]
    });
  }

  get f() {
    return this.ticketForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.ticketForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.isLoading = true;
    const formVal = this.ticketForm.value;
    const ticketData = {
      subject: `${formVal.issueType} - ${formVal.name}`,
      message: formVal.message,
      description: `Order: ${formVal.orderNumber || 'N/A'}\n\n${formVal.message}`,
      priority: 'medium',
      type: formVal.issueType,
      category: formVal.issueType, // Map issueType to category
      name: formVal.name,
      email: formVal.email,
      phone: '' // Phone not in form, create empty or add field if critical
    };

    this.ticketsService.createTicket(ticketData).subscribe({
      next: (res) => {
        alert('Ticket submitted successfully!');
        this.router.navigate(['/support/my-ticket']);
        this.isLoading = false;
      },
      error: (err) => {
        alert('Failed to submit ticket');
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
