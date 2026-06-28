import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-support-nav',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './support-nav.component.html',
  styleUrl: './support-nav.component.css',
})
export class SupportNavComponent {
  activeTab = 'faq';
  searchQuery = '';
  isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
  }
}
