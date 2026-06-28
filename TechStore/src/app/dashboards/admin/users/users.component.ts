import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { OrdersService, UsersService } from '../../../core/services';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [FormsModule,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  showUserModal = false;
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  isLoading = false;

  constructor(private SUser:UsersService,private SOrder:OrdersService){}

  ngOnInit(){
    this.loadUsers()
  }

  loadUsers(){
    this.isLoading=true
    this.SUser.getAllUsers().subscribe(res=>{
      this.users=res.users
      this.loadOrderCounts()
      this.applyFilters()
      this.isLoading=false
    })
  }

  loadOrderCounts(): void {
    this.users.forEach(user => {
      this.SOrder.getOrdersUserId(user._id).subscribe({
        next: (orders: any) => {
          user.orderCount = Array.isArray(orders) ? orders.length : (orders.orders?.length || 0);
        },
        error: (err) => {
          console.error(`Failed to load orders for user ${user._id}`, err);
          user.orderCount = 0;
        }
      });
    });
  }

  applyFilters(){
  this.filteredUsers=this.users.filter(user=>{
    const search=user.name.toLowerCase().includes(this.searchTerm.toLowerCase())||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    const role=!this.roleFilter||user.role===this.roleFilter
    const userStatus =user.isBanned?'Banned':(user.isEmailVerified?'Active':'Inactive')
    const status=!this.statusFilter||userStatus===this.statusFilter
    return search && role && status
  })
  }

  onSearchChange(){
    this.applyFilters()
  }
  onRoleFilterChange(){
    this.applyFilters();
  }
  onStatusFilterChange(){
    this.applyFilters();
  }
  handleViewUser(user:User){
    this.selectedUser=user
    this.showUserModal=true
  }
  closeModal(){
    this.showUserModal=false
    this.selectedUser=null
  }
  getUserStatus(user:User){
    if(user.isBanned) return 'Banned'
    if(user.isEmailVerified) return 'Active'
    return 'InActive'
  }
  getStatusBadge(status:string){
    switch(status){
      case 'Active':
        return 'badge-success'
      case 'Inactive':
        return 'badge-warning'
      case 'Banned':
        return 'badge-danger'
      default:
        return 'badge-secondary'
    }
  }
  toggleBanUser(user: User): void {
    const action = user.isBanned ? 'unban' : 'ban';
    
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.SUser.toggleUserBan(user._id).subscribe({
        next: () => {
          user.isBanned = !user.isBanned;
          this.applyFilters();
          
          // If modal is open for this user, update selected user
          if (this.selectedUser && this.selectedUser._id === user._id) {
            this.selectedUser = user;
          }
        },
        error: (err) => {
          console.error(`Failed to ${action} user`, err);
          alert(`Failed to ${action} user. Please try again.`);
        }
      });
    }
  }
  toggleUserActive(user: User): void {
    const action = user.isEmailVerified ? 'Active' : 'InActive';
    
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.SUser.toggleUserActive(user._id).subscribe({
        next: () => {
          user.isEmailVerified = !user.isEmailVerified;
          this.applyFilters();
          
          // If modal is open for this user, update selected user
          if (this.selectedUser && this.selectedUser._id === user._id) {
            this.selectedUser = user;
          }
        },
        error: (err) => {
          console.error(`Failed to ${action} user`, err);
          alert(`Failed to ${action} user. Please try again.`);
        }
      });
    }
  }
    getRoleDisplayName(role: string): string {
    switch (role) {
      case 'buyer':
        return 'Customer';
      case 'seller':
        return 'Seller';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  }
}
