import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface Policy {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}
@Component({
  selector: 'app-policies',
  imports: [CommonModule],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css',
})
export class PoliciesComponent {
policies: Policy[] = [];

  constructor() {}

  ngOnInit(): void {
    this.policies = [
      {
        title: 'Return Policy',
        description: 'Learn about our 30-day return guarantee',
        icon: 'bi-box-seam',
        iconColor: 'text-danger'
      },
      {
        title: 'Shipping Policy',
        description: 'Shipping methods, costs, and delivery times',
        icon: 'bi-truck',
        iconColor: 'text-danger'
      },
      {
        title: 'Warranty Policy',
        description: 'Product warranties and coverage details',
        icon: 'bi-shield-check',
        iconColor: 'text-danger'
      },
      {
        title: 'Privacy Policy',
        description: 'How we protect and use your data',
        icon: 'bi-lock',
        iconColor: 'text-danger'
      },
      {
        title: 'Terms & Conditions',
        description: 'Terms of service and user agreement',
        icon: 'bi-file-text',
        iconColor: 'text-danger'
      }
    ];
  }
}
