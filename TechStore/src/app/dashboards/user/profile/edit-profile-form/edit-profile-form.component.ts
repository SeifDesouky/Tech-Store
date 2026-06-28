import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../core/services/users.service';
import { User, UpdateUserRequest } from '../../../../core/models/user.model';

@Component({
    selector: 'app-edit-profile-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-profile-form.component.html',
    styleUrl: './edit-profile-form.component.css'
})
export class EditProfileFormComponent implements OnInit {
    @Input() user: User | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    profileForm: FormGroup;
    isLoading = false;
    error = '';

    constructor(private fb: FormBuilder, private userService: UsersService) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]]
        });
    }

    ngOnInit(): void {
        if (this.user) {
            this.profileForm.patchValue({
                name: this.user.name,
                email: this.user.email,
                phone: this.user.phone
            });
        }
    }

    onOverlayClick(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.error = '';

        const updateData: UpdateUserRequest = this.profileForm.value;

        this.userService.updateProfile(updateData).subscribe({
            next: () => {
                this.isLoading = false;
                this.saved.emit();
                this.close.emit();
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Failed to update profile';
            }
        });
    }

    get control() {
        return this.profileForm.controls;
    }
}
