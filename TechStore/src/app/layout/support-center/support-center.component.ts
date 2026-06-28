import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupportNavComponent } from "./related-support-component/support-nav/support-nav.component";
import { Router, RouterOutlet } from '@angular/router';
import { FaqsService } from '../../core/services/faqs.service';
import { AuthService } from '../../core/services/auth/auth.service';
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}
@Component({
  selector: 'app-support-center',
  imports: [FormsModule, CommonModule, SupportNavComponent, RouterOutlet],
  templateUrl: './support-center.component.html',
  styleUrl: './support-center.component.css',
})
export class SupportCenterComponent {
  activeTab = 'faq';
  searchQuery = '';


  constructor(private faqsService: FaqsService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadFaqs();
  }
  

  loadFaqs() {
    this.faqsService.getAllFAQs().subscribe({
      next: (res: any) => {
        const faqs = res.faqs || res || [];
        this.groupFaqs(faqs);
      },
      error: (err) => console.error(err)
    });
  }

  groupFaqs(faqs: any[]) {
    const groups: { [key: string]: FAQItem[] } = {};

    faqs.forEach(faq => {
      const cat = faq.category || 'General';
      if (!groups[cat]) groups[cat] = [];

      groups[cat].push({
        question: faq.question,
        answer: faq.answer
      });
    });

    this.faqCategories = Object.keys(groups).map(key => ({
      name: key,
      items: groups[key]
    }));
  }

  // Pre-defined categories removed/overwritten by dynamic loading
  faqCategories: FAQCategory[] = [];

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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
  }
}
