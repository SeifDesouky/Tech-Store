import { Component } from '@angular/core';
import { INotification } from '../../../core/models/notf.model';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule,NgFor,NgIf],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  filter:'all' | 'orders' |'promotions'='all'
  notifications:INotification[]=[]
  constructor(private notfService:NotificationService){}
  ngOnInit(){
    this.notifications=this.notfService.getNotifications()
  }

  setFilter(value:'all' | 'orders' |'promotions'){
    this.filter=value
  }
  get filtered():INotification[]{
    if(this.filter==='orders'){
      return this.notifications.filter(n=>['order','delivery','refund'].includes(n.type))
    }
    if(this.filter==='promotions'){
      return this.notifications.filter(n=>n.type==='promotion')
    }
    return this.notifications
  }

  getIcon(type:INotification['type']):string{
    switch(type){
      case 'order':
        return 'bi-box-seam';
      case 'delivery':
        return 'bi-truck';
      case 'refund':
        return 'bi-currency-dollar';
      case 'promotion':
        return 'bi-tag';
    }
  }
}
