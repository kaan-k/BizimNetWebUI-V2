import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { ToastrService } from 'ngx-toastr';
import { UserComponentService } from '../../../services/component/user/user-component.service'; 

@Component({
  selector: 'app-reset-password-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    NgSelectModule 
  ], 
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class ResetUserPasswordDialog implements OnInit {
  resetForm!: FormGroup;
  isLoading: boolean = false;
  
  users: any[] = []; 
  currentUserId: string | null = null;
  isAuthorized: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ResetUserPasswordDialog>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserComponentService,
  ) {}

  async ngOnInit() {
    this.currentUserId = localStorage.getItem("userId");
    this.createResetForm(); // Create form first
    await this.loadDataBasedOnPermission(); // Then load data
  }

  createResetForm() {
    this.resetForm = this.formBuilder.group({
      email: [null, Validators.required], // Initialize as null
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async loadDataBasedOnPermission() {
    if (!this.currentUserId) return;

    const currentUser = await this.userService.getById(this.currentUserId);
    
    if (currentUser) {
        this.isAuthorized = currentUser.isAuthorised; // Make sure this matches your DTO property case!

        if (this.isAuthorized) {
            this.users = await this.userService.getAllUser();
        } else {
            this.users = [currentUser];
            // Auto-select for non-admins
            this.resetForm.patchValue({ email: currentUser.email });
            this.resetForm.get('email')?.disable(); 
        }
    }
  }

  resetPassword() {
    // Manually check validity here so we can show the toast
    if (this.resetForm.invalid) {
      this.toastrService.warning('Lütfen geçerli bir kullanıcı seçin ve en az 6 karakterli bir şifre girin.');
      this.resetForm.markAllAsTouched(); // Show red borders
      return;
    }

    this.isLoading = true;
    // getRawValue() is CRITICAL if the email field is disabled
    const resetModel = this.resetForm.getRawValue();

    this.userService.changePassword(resetModel).then(res => {
        this.toastrService.success(`Şifre başarıyla güncellendi.`);
        this.isLoading = false;
        this.dialogRef.close(true);
    }).catch(err => {
        this.toastrService.error('Sıfırlama başarısız oldu. Sunucu hatası.');
        this.isLoading = false;
    });
  }
}