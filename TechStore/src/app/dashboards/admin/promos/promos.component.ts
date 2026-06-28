import { Component } from '@angular/core';
import { CreatePromoRequest, Promo } from '../../../core/models/promo.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromosService } from '../../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promos',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './promos.component.html',
  styleUrl: './promos.component.css',
})
export class PromosComponent {
  promoForm!: FormGroup;
  promos: Promo[] = [];
  loading = false;
  stats = {
    totalCampaigns: 0,
    totalSent: 0,
    avgOpenRate: '0%',
    avgClickRate: '0%'
  };
  promoTypes = [
    { value: 'Percentage', label: 'Percentage Discount (%)' },
    { value: 'Fixed', label: 'Fixed Amount Discount ($)' },
    { value: 'FreeShipping', label: 'Free Shipping' },
    { value: 'BuyXGetY', label: 'Buy X Get Y' }
  ]

  constructor(private fb:FormBuilder,private SPromo:PromosService){
      this.promoForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      type: ['Percentage', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      minPurchase: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      usageLimitPerUser: [1, [Validators.required, Validators.min(1)]],
      totalUsageLimit: [100, [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit(){
    this.loadPromos()
  }

  loadPromos(): void {
    this.loading = true;
    this.SPromo.getAllPromosAdmin().subscribe({
      next: (res) => {
        this.promos = res.promos || [];
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading promos:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalCampaigns = this.promos.length;
    this.stats.totalSent = this.promos.reduce((sum, p) => sum + (p.usedCount || 0), 0);
    
    const activePromos = this.promos.filter(p => p.active && !this.isExpired(p.endDate)).length;
    const totalPromos = this.promos.length;
    
    if (totalPromos > 0) {
      this.stats.avgOpenRate = ((activePromos / totalPromos) * 100).toFixed(1) + '%';
      
      const totalUsage = this.promos.reduce((sum, p) => sum + (p.usedCount || 0), 0);
      const totalLimit = this.promos.reduce((sum, p) => sum + p.totalUsageLimit, 0);
      this.stats.avgClickRate = totalLimit > 0 
        ? ((totalUsage / totalLimit) * 100).toFixed(1) + '%' 
        : '0%';
    }
  }
  isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }

  onSubmit(): void {
    if (this.promoForm.valid) {
      this.loading = true;
      const promoData: CreatePromoRequest = this.promoForm.value;
      this.SPromo.createPromo(promoData).subscribe({
        next: (res) => {
          console.log('Promo created successfully:', res);
          alert('Promotion created successfully!');
          this.promoForm.reset({
            type: 'Percentage',
            value: 0,
            minPurchase: 0,
            usageLimitPerUser: 1,
            totalUsageLimit: 100
          });
          this.loadPromos();
        },
        error: (error) => {
          console.error('Error creating promo:', error);
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.promoForm.controls).forEach(key => {
        this.promoForm.get(key)?.markAsTouched();
      });
      alert('Please fill all required fields correctly.');
    }
  }

  deletePromo(id: string): void {
    if (confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      this.loading = true;
      this.SPromo.deletePromo(id).subscribe({
        next: (res) => {
          console.log('Promo deleted:', res.message);
          alert('Promotion deleted successfully!');
          this.loadPromos();
        },
        error: (error) => {
          console.error('Error deleting promo:', error);
          alert('Error deleting promotion. Please try again.');
          this.loading = false;
        }
      });
    }
  }

  getTypeLabel(type: string): string {
    const found = this.promoTypes.find(t => t.value === type);
    return found ? found.label : type;
  }
  getStatusVariant(active: boolean, endDate: string): string {
    return active && !this.isExpired(endDate) ? 'success' : 'danger';
  }
  getStatusText(active: boolean, endDate: string): string {
    if (!active) return 'Disabled';
    if (this.isExpired(endDate)) return 'Expired';
    return 'Active';
  }

}
