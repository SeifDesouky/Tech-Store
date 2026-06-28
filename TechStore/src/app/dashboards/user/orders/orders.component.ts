import { Component } from '@angular/core';
import { Order, ReturnOrderRequest } from '../../../core/models/order.model';
import { OrdersService } from '../../../core/services';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  orders: Order[] = []
  expandedOrderId: string | null = null;
  statusFilter: 'all' | Order['orderStatus'] = 'all'
  filteredOrders: Order[] = []
  showReturnModal = false
  returnedOrder: Order | null = null
  returnRequest:ReturnOrderRequest|null=null
  returnReasons: { value: ReturnOrderRequest['reason']; label: string }[] = [
  { value: 'Product defective/damaged', label: 'Defective or damaged product' },
  { value: 'Wrong item received', label: 'Received wrong item' },
  { value: "Product doesn't match description", label: 'Not as described' },
  { value: 'Missing accessories/parts', label: 'Missing accessories or parts' }
];
  returnReason: ReturnOrderRequest['reason'] | '' = '';
  returnExplanation: string = '';
  returnImages: string[] = [];


  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (res: any) => {
        // Check if res is array or object containing array
        this.orders = Array.isArray(res) ? res : (res.orders || []);
        this.filteredOrders = this.orders;
        console.log(res);
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  filterOrders() {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders]
    } else {
      this.filteredOrders = this.orders.filter(o => o.orderStatus === this.statusFilter)
    }
  }

  toggleDetails(orderId: string) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId
  }
  isExpanded(orderId: string) {
    return this.expandedOrderId === orderId
  }
  getStatusStyle(status: Order['orderStatus']) {
    const styles: Record<Order['orderStatus'], { text: string; color: string }> = {
      Pending: { text: 'Pending', color: '#6b7280' },
      Processing: { text: 'Processing', color: '#f59e0b' },
      Shipped: { text: 'Shipped', color: '#3b82f6' },
      'Out for Delivery': { text: 'Out for Delivery', color: '#6366f1' },
      Delivered: { text: 'Delivered', color: '#10b981' },
      Cancelled: { text: 'Cancelled', color: '#ef4444' },
      Returned: { text: 'Returned', color: '#a855f7' }
    };

    return styles[status] || styles['Pending'];
  }

  getReturnStatusBadge(order: Order): any {
    if (!order.returnRequest) return null;

    const styles: any = {
      Pending: { bg: '#f59e0b', text: 'Return Pending' },
      Approved: { bg: '#10b981', text: 'Return Approved' },
      Rejected: { bg: '#ef4444', text: 'Return Rejected' }
    };
    return styles[order.returnRequest.status.toLowerCase()];
  }

  getOrderProgress(status: Order['orderStatus']) {
    const steps = [
      { label: 'Order Placed', completed: true },
      { label: 'Processing', completed: ['Processing', 'Shipped', 'Delivered', 'Out for Delivery'].includes(status) },
      { label: 'Shipped', completed: ['Shipped', 'Delivered', 'Out for Delivery'].includes(status) },
      { label: 'Delivered', completed: status === 'Delivered' }
    ]
    if (status === 'Cancelled' || status === 'Returned') {
      return [
        { label: 'Order Placed', completed: true },
        { label: status, completed: true }
      ];
    }
    return steps;
  }

  openReturnModal(order: Order) {
    this.returnedOrder = order
    this.showReturnModal = true
    this.returnReason = ''
    this.returnExplanation = ''
    this.returnImages = []
  }
  closeReturnModal() {
    this.showReturnModal = false
    this.returnedOrder = null
  }

  handleFileUpload(event: any) {
    const files = event.target.files;
    this.returnImages = []; // تفريغ المصفوفة قبل الإضافة

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.returnImages.push(e.target.result); // الصورة كـ Base64
      };
      reader.readAsDataURL(files[i]);
    }
  }

  isReturnEligible(order: Order): boolean {
    return order.orderStatus === 'Delivered' && !order.returnRequest;
  }
  submitReturn() {
      if (!this.returnedOrder) return;
    const orderId = this.returnedOrder._id;
    if (!this.returnReason || !this.returnExplanation) {
      alert('Please fill all required fields');
      return;
    }

    // if (this.returnImages.length === 0) {
    //   alert('Please upload at least one proof image');
    //   return;
    // }

    // نجهز البيانات للإرسال
    const payload :any= {
      reason: this.returnReason,
      comment: this.returnExplanation,
      proofImages: this.returnImages // Array of Base64 strings
    };

    this.orderService.requestReturn(orderId, payload).subscribe({
      next: (res) => {
        console.log('Return requested successfully', res);
        alert('Return request submitted successfully!');
        this.closeReturnModal(); // تقفل المودال بعد الإرسال
        this.returnImages = [];
        this.returnReason = '';
        this.returnExplanation = '';
      },
      error: (err) => {
        console.error('Error requesting return', err);
      }
    });
  }


  getProductName(item: any): string {
    return typeof item.product === 'string' ? item.product : item.product.name
  }
  getProductImg(item: any): string {
    return typeof item.product === 'string' ? item.product : item.product.images?.[0] || null
  }
}
