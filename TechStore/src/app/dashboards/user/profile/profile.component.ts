import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Address, User } from '../../../core/models/user.model';
import { UsersService } from '../../../core/services';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ResetPasswordComponent } from '../../../layout/Auth/reset-password/reset-password.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ResetPasswordComponent, AddressFormComponent, EditProfileFormComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  addresses: Address[] = [];
  user: User = {} as User;
  isChangingPassword = false;
  isAddressFormOpen = false;
  isEditProfileOpen = false;
  editingAddress: Address | null = null;

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadAddresses();
  }

  loadUser() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser._id) {
      this.userService.getUserById(currentUser._id).subscribe({
        next: (res) => {
          this.user = res.user;
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
          this.user = currentUser; // Fallback
        }
      });
    }
  }

  loadAddresses() {
    this.userService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res.addresses || [];
        console.log(res);
        
      },
      error: (err) => {
        console.error('Error loading addresses:', err);
      }
    });
  }

  openEditProfile() {
    this.isEditProfileOpen = true;
  }

  closeEditProfile() {
    this.isEditProfileOpen = false;
  }

  get authToken(): string {
    return this.authService.getToken() || '';
  }

  changePassword() {
    this.isChangingPassword = true;
  }

  toggleChangePassword() {
    this.isChangingPassword = !this.isChangingPassword;
  }

  openAddAddress() {
    this.editingAddress = null;
    this.isAddressFormOpen = true;
  }

  openEditAddress(address: Address | any) {
    this.editingAddress = address;
    this.isAddressFormOpen = true;
  }

  closeAddressForm() {
    this.isAddressFormOpen = false;
    this.editingAddress = null;
  }

  onAddressSaved() {
    this.loadAddresses(); // Refresh addresses
  }

  deleteAddress(addressId: string | undefined) {
    if (!addressId) return;
    if (confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(addressId).subscribe({
        next: () => {
          this.loadAddresses(); // Refresh addresses
        },
        error: (err) => {
          console.error('Error deleting address:', err);
          alert('Failed to delete address');
        }
      });
    }
  }

  setDefaultAddress(addressId: string | undefined) {
    if (!addressId) return;
    this.userService.updateAddress(addressId, { isDefault: true }).subscribe({
      next: () => {
        this.loadAddresses(); // Refresh addresses
      },
      error: (err) => {
        console.error('Error setting default address:', err);
        alert('Failed to set default address');
      }
    });
  }
}