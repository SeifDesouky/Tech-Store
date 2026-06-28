import { Component } from '@angular/core';
import { Order, UpdateOrderStatusRequest } from '../../../core/models/order.model';
import { OrdersService } from '../../../core/services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-orders',
  imports: [FormsModule,CommonModule],
  templateUrl: './track-orders.component.html',
  styleUrl: './track-orders.component.css',
})
export class TrackOrdersComponent {
  orders:Order[]=[]
  searchTerm: string = '';
  statusFilter: string = '';
  sortOrder: 'newest' | 'oldest' | '' = 'newest';
  selectedOrder: Order | null = null;
  showOrderModal: boolean = false;
  orderNumber:string=''
  newStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned'='Pending';
  isLoading=false
  trackingNumber:string=''
  adminNote: string = '';

  stats = {
    total: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0
  };
  constructor(private SOrder:OrdersService){}
  ngOnInit(){
    this.loadOrders()
  }

  loadOrders(){
    this.isLoading=true
    this.SOrder.getAllOrders().subscribe({
      next:(res)=>{
        this.orders=res.orders||[]
        this.calculateStats()
        this.isLoading=false
      },
      error:(err)=>console.error('error loading',err)
      
    })
  }
  calculateStats() {
    this.stats = {
      total: this.orders.length,
      processing: this.orders.filter(o => o.orderStatus === 'Processing').length,
      shipped: this.orders.filter(o => o.orderStatus === 'Shipped').length,
      completed: this.orders.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: this.orders.filter(o => o.orderStatus === 'Cancelled').length
    };
  }
  handleViewOrder(order: Order) {
    this.selectedOrder = order;
    this.newStatus = order.orderStatus; // Initialize select with current status
    this.adminNote = order.internalNotes || '';
    this.showOrderModal = true;
  }

  closeModal() {
    this.showOrderModal = false;
    this.selectedOrder = null;
  }
  updateStatus() {
    if (!this.selectedOrder) return;

  const payload: any = {
      status: this.newStatus
    };
    if (this.trackingNumber && this.trackingNumber.trim()) {
      payload.trackingNumber = this.trackingNumber.trim();
    }
    if (this.adminNote && this.adminNote.trim()) {
      payload.internalNotes = this.adminNote.trim();
    }
console.log('Payload being sent:', payload); 

    this.SOrder.updateOrderStatus(this.selectedOrder._id, payload).subscribe({
      next: (res) => {
        console.log('Success:', res); 
        const index = this.orders.findIndex(o => o._id === res.order._id);
        if (index !== -1) {
          this.orders[index] = res.order;
          this.calculateStats();
        }
        this.closeModal();
        alert('Order Updated Successfully');
      },
      error: (err) => console.error('Update failed', err)
    });
  }
  get filteredOrders(): Order[] {
    let filtered = this.orders.filter(order => {
      const orderId = order.orderNumber || order._id;
      const userName = typeof order.user === 'object' ? order.user.name : 'Unknown';
      
      const matchesSearch = orderId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            userName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || order.orderStatus === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
    if (this.sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return filtered;
  }

  getStatusBadgeClass(status:string) {
    switch (status) {
      case 'Delivered':
        return 'bg-success';

      case 'Shipped':
        return 'bg-primary';

      case 'Processing':
        return 'bg-warning text-dark';

      case 'Cancelled':
      case 'Returned':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }
  }

  getProductName(item: any): string {
    return typeof item.product === 'string' ? item.product : item.product.name
  }
  getUserName(item: any): string {
    return typeof item.user === 'string' ? item.user : item.user.name
  }
  getUserEmail(item: any): string {
    return typeof item.user === 'string' ? item.user : item.user.email
  }
  
}
