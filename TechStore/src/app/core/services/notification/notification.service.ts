import { Injectable } from '@angular/core';
import { INotification } from '../../models/notf.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: INotification[] = [
    {
      id: '1',
      type: 'delivery',
      message: 'Your order #12345 has been delivered successfully',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: '2',
      type: 'order',
      message: 'Order #12344 has been confirmed and is being processed',
      timestamp: '5 hours ago',
      isRead: false
    },
    {
      id: '3',
      type: 'promotion',
      message: 'Flash Sale! Get 40% off on electronics',
      timestamp: '1 day ago',
      isRead: true
    },
    {
      id: '4',
      type: 'refund',
      message: 'Refund of $89.99 has been processed',
      timestamp: '2 days ago',
      isRead: true
    }
  ];

  getNotifications(): INotification[] {
    return this.notifications;
  }
}
