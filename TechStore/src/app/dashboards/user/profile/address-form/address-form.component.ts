import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../core/services/users.service';
import { Address } from '../../../../core/models/user.model';

@Component({
    selector: 'app-address-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './address-form.component.html',
    styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnInit {
    @Input() address: Address | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    addressForm: FormGroup;
    governorates: any[] = [];
    isLoading = false;
    error = '';

    constructor(private fb: FormBuilder, private userService: UsersService) {
        this.addressForm = this.fb.group({
            label: ['', [Validators.required, Validators.pattern(/^(Home|Work|Other)$/)]],
            street: ['', Validators.required],
            city: ['', Validators.required],
            governorate: ['', Validators.required],
            zipCode: ['', [Validators.required]],
            isDefault: [false]
        });
    }

    ngOnInit(): void {
        this.loadGovernorates();

        if (this.address) {
    this.addressForm.patchValue({
      label: this.address.label,
      street: this.address.street,
      city: this.address.city,
      governorate: typeof this.address.governorate === 'object'
        ? this.address.governorate._id
        : this.address.governorate,
      zipCode: this.address.zipCode,
      isDefault: this.address.isDefault
    });
  }
    }

    loadGovernorates() {
        this.userService.getAllGovernorates().subscribe({
            next: (res) => this.governorates = res,
            error: () => this.error = 'Failed to load governorates'
        });
    }

    onOverlayClick(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.addressForm.invalid) {
            this.addressForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.error = '';

        const addressData = this.addressForm.value;

        if (this.address && this.address._id) {
            // Update
            this.userService.updateAddress(this.address._id, addressData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.saved.emit();
                    this.close.emit();
                },
                error: (err) => {
                    this.isLoading = false;
                    this.error = err.error?.message || 'Failed to update address';
                }
            });
        } else {
            // Add
            this.userService.addAddress(addressData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.saved.emit();
                    this.close.emit();
                },
                error: (err) => {
                    this.isLoading = false;
                    this.error = err.error?.message || 'Failed to add address';
                }
            });
        }
    }

    get control() {
        return this.addressForm.controls;
    }
}
