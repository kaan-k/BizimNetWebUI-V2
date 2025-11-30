import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
// Material Imports
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-customer',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule
  ],
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.css'
})
export class UpdateCustomerComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  customerForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private customerComponentService: CustomerComponentService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<UpdateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Receive data here
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    // We use 'this.data' which is injected from the parent component
    this.customerForm = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, Validators.required],
      companyName: [this.data.companyName, Validators.required],
      email: [this.data.email,],
      phoneNumber: [this.data.phoneNumber],
      address: [this.data.address],
      country: [this.data.country],
      city: [this.data.city],
      customerField: [this.data.customerField],
      taxid: [this.data.taxid],
      status: [this.data.status, Validators.required],
      
      // Hidden/System fields (kept for payload integrity, but not shown in HTML)
      createdAt: [this.data.createdAt],
      updatedAt: [this.data.updatedAt],
      lastActionDate: [this.data.lastActionDate],
      lastAction: [this.data.lastAction]
    });
  }

  updateCustomer() {
    if (this.customerForm.invalid) {
      this.toastrService.warning(this.lang.pleaseFillİnformation || 'Lütfen gerekli alanları doldurunuz.');
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const model = { ...this.customerForm.value };
    
    // Clean up string fields
    model.phoneNumber = model.phoneNumber?.toString();

    this.customerComponentService.updateCustomer(model, () => {
      this.isLoading = false;
      // Close dialog and pass 'true' to indicate success
      this.dialogRef.close(true); 
      this.toastrService.success(this.lang.updateCustomer + ' ' + 'Güncelleme Başarılı');
    });
  }
}