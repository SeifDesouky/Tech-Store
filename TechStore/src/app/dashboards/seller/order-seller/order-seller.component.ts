import { Component } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdersService, SellerOrderStats } from '../../../core/services';

@Component({
  selector: 'app-order-seller',
  imports: [FormsModule,CommonModule],
  templateUrl: './order-seller.component.html',
  styleUrl: './order-seller.component.css',
})
export class OrderSellerComponent {
  orders: any[] = [];
    filteredOrders: any[] = [];
    
    // Stats
    stats = {
        total: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0
    };

    // Filters
    searchTerm = '';
    statusFilter = '';
    sortOrder = '';

    // Modal
    showOrderModal = false;
    selectedOrder: any = null;
    newStatus = '';
    adminNote = '';

    isLoading = false;

    constructor(private ordersService: OrdersService) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.isLoading = true;

        this.ordersService.getSellerOrders().subscribe({
            next: (res) => {
                this.orders = res.orders;
                this.updateStats(res.stats);
                this.applyFilters();
                this.isLoading = false;
                console.log('Seller Orders:', this.orders);
            },
            error: (err) => {
                console.error('Failed to load orders', err);
                this.isLoading = false;
                alert('Failed to load orders');
            }
        });
    }

    updateStats(apiStats: SellerOrderStats) {
        this.stats = {
            total: apiStats.totalOrders,
            processing: apiStats.pendingOrders,
            shipped: apiStats.shippedOrders,
            completed: apiStats.deliveredOrders,
            cancelled: this.orders.filter(o => o.orderStatus === 'Cancelled').length
        };
    }

    applyFilters() {
        this.filteredOrders = this.orders.filter(order => {
            // Search filter
            const searchMatch = !this.searchTerm || 
                order.orderNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                this.getUserName(order)?.toLowerCase().includes(this.searchTerm.toLowerCase());

            // Status filter
            const statusMatch = !this.statusFilter || 
                order.orderStatus === this.statusFilter;

            return searchMatch && statusMatch;
        });

        // Sort
        if (this.sortOrder === 'newest') {
            this.filteredOrders.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else if (this.sortOrder === 'oldest') {
            this.filteredOrders.sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        }
    }

    handleViewOrder(order: any) {
        this.selectedOrder = order;
        this.newStatus = order.orderStatus;
        this.adminNote = order.internalNotes || '';
        this.showOrderModal = true;
    }

    closeModal() {
        this.showOrderModal = false;
        this.selectedOrder = null;
        this.newStatus = '';
        this.adminNote = '';
    }

    // updateStatus() {
    //     if (!this.selectedOrder) return;

    //     const payload: any = {
    //         status: this.newStatus
    //     };

    //     if (this.adminNote && this.adminNote.trim()) {
    //         payload.internalNotes = this.adminNote.trim();
    //     }

    //     console.log('Payload being sent:', payload);

    //     this.ordersService.updateOrderStatus(this.selectedOrder._id, payload).subscribe({
    //         next: (res) => {
    //             console.log('Success:', res);

    //             // ✅ تحديث الطلب في القائمة
    //             const index = this.orders.findIndex(o => o._id === res.order._id);
    //             if (index !== -1) {
    //                 this.orders[index] = res.order;
    //             }
    //             // إعادة حساب الـ Stats
    //             this.applyFilters();
    //             this.closeModal();
    //             alert('Order Updated Successfully');
    //         },
    //         error: (err) => {
    //             console.error('Update failed', err);
    //             alert('Failed to update order');
    //         }
    //     });
    // }

    // Helper functions
updateStatus() {
    if (!this.selectedOrder) return;

  const payload: any = {
      status: this.newStatus
    };
    if (this.adminNote && this.adminNote.trim()) {
      payload.internalNotes = this.adminNote.trim();
    }
console.log('Payload being sent:', payload); 

    this.ordersService.updateOrderStatus(this.selectedOrder._id, payload).subscribe({
      next: (res) => {
        console.log('Success:', res); 
        const index = this.orders.findIndex(o => o._id === res.order._id);
        if (index !== -1) {
          this.orders[index] = res.order;
        }
        this.closeModal();
        alert('Order Updated Successfully');
      },
      error: (err) => console.error('Update failed', err)
    });
  }

    getUserName(order: any): string {
        if (!order.user) return 'N/A';
        if (typeof order.user === 'string') return order.user;
        return order.user.name || 'N/A';
    }

    getUserEmail(order: any): string {
        if (!order.user) return 'N/A';
        if (typeof order.user === 'string') return 'N/A';
        return order.user.email || 'N/A';
    }

    getProductName(item: any): string {
        if (!item.product) return item.name || 'Unknown Product';
        if (typeof item.product === 'string') return item.name || 'Unknown Product';
        return item.product.name || item.name || 'Unknown Product';
    }

    getStatusBadgeClass(status: string): string {
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

}
