import { Component } from '@angular/core';
import { SellerWithStats, User } from '../../../core/models/user.model';
import { ProductsService, UsersService } from '../../../core/services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sellers',
  imports: [FormsModule,CommonModule],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.css',
})
export class SellersComponent {
  sellers: SellerWithStats[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  selectedSeller: SellerWithStats | null = null;
  showSellerModal: boolean = false;
  isLoading=false

stats = {
  total: 0,
  pending: 0,
  revenue: 0,
  products: 0
};


  constructor(private SUser:UsersService,private SProduct:ProductsService){}
  
  ngOnInit(){
    this.loadSellers()
    // this.loadStats()
  }
  // loadSellers(){
  //   this.SUser.getSellers().subscribe({
  //     next: (res) => {
  //       this.isLoading=true
  //       this.sellers = res.users || [];
  //       // this.calculateStats();
  //       this.isLoading=false
  //     },
  //     error: (err) => console.error(err)
  //   })
  // }
  loadSellers() {
  this.SUser.getSellers().subscribe({
    next: (res) => {
      this.sellers = res.users || [];
      this.calculateStats();
    },
    error: err => console.error(err)
  });
}


  // loadStats() {
  //   this.SProduct.getSellersStats().subscribe({
  //     next: (res) => {
  //       this.sellers = res.sellers || [];
  //       this.calculateStats();
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load sellers stats', err);
  //       this.isLoading = false;
  //     }
  //   });
  // };
  loadStats() {
  this.SProduct.getSellersStats().subscribe({
    next: (res) => {
      const sellers = res.sellers || [];

      this.stats = {
        total: sellers.length,
        pending: sellers.filter(s => s.accountStatus === 'pending').length,
        revenue: sellers.reduce((acc, s) => acc + (s.revenue || 0), 0),
        products: sellers.reduce((acc, s) => acc + (s.productsCount || 0), 0),
      };
    },
    error: err => console.error(err)
  });
}

  calculateStats(){
      this.stats = {
      total: this.sellers.length,
      pending: this.sellers.filter(s => s.accountStatus === 'pending').length,
      revenue: this.sellers.reduce((acc, curr) => acc + (curr.revenue || 0), 0),
      products: this.sellers.reduce((acc, curr) => acc + (curr.productsCount || 0), 0)
    };
  }
  
  get filteredSellers(): SellerWithStats[] {
    return this.sellers.filter(seller => {
      const matchSearch = 
        seller.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        seller.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchStatus = true;
      if (this.statusFilter) {
        if (this.statusFilter === 'Banned') {
          matchStatus = seller.isBanned;
        } else {
          matchStatus = seller.accountStatus.toLowerCase() === this.statusFilter.toLowerCase() && !seller.isBanned;
        }
      }

      return matchSearch && matchStatus;
    });
  }

  handleAction(action: 'approve' | 'reject') {
    if (!this.selectedSeller) return;

    if (confirm(`Are you sure you want to ${action} this seller?`)) {
      this.SUser.updateSellerStatus(this.selectedSeller._id, action).subscribe({
        next: (res) => {
          // تحديث القائمة محلياً
          const index = this.sellers.findIndex(s => s._id === res.user._id);
          if (index !== -1) {
            this.sellers[index] = { ...this.sellers[index], ...res.user }; // دمج البيانات الجديدة
          }
          if (this.selectedSeller) {
              this.selectedSeller = { ...this.selectedSeller, ...res.user };
          }
          this.calculateStats();
          // يمكنك إغلاق المودال أو تركه مفتوحاً لرؤية التحديث
        },
        error: (err) => alert('Error updating status')
      });
    }
  }

  getBadgeClass(seller: { accountStatus: string; isBanned: boolean }): string {
    if (seller.isBanned) return 'bg-dark';
    switch (seller.accountStatus.toLowerCase()) {
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning text-white';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  updateSellerStatus(id: string, action: 'approved' | 'rejected') {
  this.SUser.approveSeller(id,action).subscribe({
    next: (res) => {
      // تحديث local state
      const index = this.sellers.findIndex(s => s._id === id);
      console.log(res)
      if (index !== -1) {
        this.sellers[index].accountStatus = action === 'approved' ? 'approved' : 'rejected';
      }
      this.calculateStats(); // لو عندك stats
    },
    error: (err) => console.error('Action failed', err)
  });
}
}
