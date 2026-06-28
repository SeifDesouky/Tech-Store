import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}
@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  searchQuery = '';
 faqCategories: FAQCategory[] = [
    {
      name: 'Orders & Shipping',
      items: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 3–5 business days. Express shipping is available for 1–2 day delivery. You will receive a tracking number once your order ships.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you will receive an email with a tracking number. You can also track your order by logging into your account and viewing your order history.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. International shipping times vary by destination, typically 7–14 business days. Additional customs fees may apply.'
        }
      ]
    },
    {
      name: 'Payment',
      items: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.'
        }
      ]
    },
    {
      name: 'Returns & Refunds',
      items: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day money-back guarantee on all products. Items must be returned in their original condition with all packaging and accessories. Refunds are processed within 5-7 business days of receiving your return.'
        },
        {
          question: 'How do I initiate a return?',
          answer: 'To start a return, log into your account and go to your order history. Select the order you wish to return and click "Request Return". Follow the instructions to print your prepaid return label.'
        }
      ]
    },
    {
      name: 'Account',
      items: [
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link. Follow the link to create a new password for your account.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'Log into your account and navigate to "Account Settings". From there, you can update your email, shipping address, payment methods, and other personal information.'
        }
      ]
    },
    {
      name: 'Products & Warranty',
      items: [
        {
          question: 'Do your products come with a warranty?',
          answer: 'Yes, all our products come with a 1-year manufacturer warranty covering defects in materials and workmanship. Extended warranty options are available at checkout.'
        },
        {
          question: 'How do I claim warranty service?',
          answer: 'Contact our support team with your order number and a description of the issue. We\'ll guide you through the warranty claim process and arrange for repair or replacement as needed.'
        }
      ]
    }
  ];

  get filteredCategories(): FAQCategory[] {
    if (!this.searchQuery.trim()) {
      return this.faqCategories;
    }

    const query = this.searchQuery.toLowerCase();
    return this.faqCategories
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.items.length > 0);
  }
}
