import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog stuff
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent implements OnInit {
  
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  customerForm: FormGroup;

  constructor(
    private customerComponentService: CustomerComponentService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<AddCustomerComponent> // Inject DialogRef
  ) {}

  ngOnInit() {
    this.createCustomerForm();
  }

  createCustomerForm() {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required], // Added validators based on your logic
      companyName: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      country: ['Türkiye'],
      taxid: [''],
      city: [''],
      customerField: [''],
      status: ['Active'], // Default to active usually looks better
      createdAt: [new Date()],
      updatedAt: [new Date()],
      lastActionDate: [new Date()],
      lastAction: ['']
    });
  }

  addCustomer() {
    if (this.customerForm.valid) {
      const model = Object.assign({}, this.customerForm.value);
      model.phoneNumber = model.phoneNumber ? model.phoneNumber.toString() : '';
      
      this.customerComponentService.addCustomer(model, () => {
        // Close dialog and return 'true' to signal refresh
        this.dialogRef.close(true);
      });
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error);
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}