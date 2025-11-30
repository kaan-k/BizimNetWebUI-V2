import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../../models/customers/cusotmers';

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
  
  // list of potential parent companies
  headquarters: Customer[] = []; 
  isBranchMode: boolean = false;

  constructor(
    private customerComponentService: CustomerComponentService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<AddCustomerComponent>,
    // Inject Data to check if we are adding a sub-branch specifically
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { parentId?: string, parentName?: string }
  ) {}

  ngOnInit() {
    this.createCustomerForm();
    this.loadHeadquarters();

    // Check if we opened this dialog with a specific parent in mind
    if (this.data && this.data.parentId) {
      this.isBranchMode = true;
      this.customerForm.patchValue({
        parentCustomerId: this.data.parentId,
        // Optional: Pre-fill address/city from parent if you had the full object
      });
    }
  }

  createCustomerForm() {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      companyName: ['', Validators.required], // Usually required for Branches too
      parentCustomerId: [null], // <--- The Link to HQ
      email: [''],
      phoneNumber: [''],
      address: [''],
      country: ['Türkiye'],
      taxid: [''],
      city: ['İstanbul'],
      customerField: [''],
      status: ['Active'],
      createdAt: [new Date()],
      updatedAt: [new Date()],
      lastActionDate: [new Date()],
      lastAction: ['']
    });
  }

  async loadHeadquarters() {
    // Ideally, call a service method like getHeadquarters() to avoid fetching everything
    // For now, we fetch all and filter client-side
    const allCustomers = await this.customerComponentService.getAllCustomer();
    this.headquarters = allCustomers.filter(c => !c.parentCustomerId);
  }

  addCustomer() {
    if (this.customerForm.valid) {
      const model = Object.assign({}, this.customerForm.value);
      model.phoneNumber = model.phoneNumber ? model.phoneNumber.toString() : '';
      
      // Handle Parent ID for dropdowns where value might be "null" string
      if (model.parentCustomerId === 'null' || model.parentCustomerId === '') {
        model.parentCustomerId = null;
      }

      this.customerComponentService.addCustomer(model, () => {
        this.dialogRef.close(true);
        this.toastrService.success('İşlem Başarılı');
      });
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error);
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}