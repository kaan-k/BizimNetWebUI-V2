import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';

// Services
import { AggrementComponentService } from '../../../services/component/aggrement-component.service';
import { CustomerComponentService } from '../../../services/component/customer-component.service';

// Models
import { AggrementDto } from '../../../models/aggrements/aggrementDto';
import { Customer } from '../../../models/customers/cusotmers'; 

@Component({
  selector: 'app-add-agreement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-agreement.component.html',
  styleUrl: './add-agreement.component.css'
})
export class AddAgreementComponent implements OnInit {

  addForm: FormGroup;
  customers: Customer[] = []; 

  constructor(
    private formBuilder: FormBuilder,
    private agreementService: AggrementComponentService,
    private customerService: CustomerComponentService, 
    public dialogRef: MatDialogRef<AddAgreementComponent>
  ) {}

  ngOnInit(): void {
    this.createAddForm();
    this.loadCustomers(); 
  }

  async loadCustomers() {
    try {
      this.customers = await this.customerService.getAllCustomer();
    } catch (error) {
      console.error("Müşteriler yüklenirken hata oluştu", error);
    }
  }

  createAddForm() {
    this.addForm = this.formBuilder.group({
      aggrementTitle: ["", Validators.required],
      customerId: [null, Validators.required], // Initialize as null for ng-select
      aggrementType: ["", Validators.required],
      agreedAmount: [0, [Validators.required, Validators.min(1)]],
      expirationDate: [null]
    });
  }

  save() {
    if (this.addForm.valid) {
      const formValues = this.addForm.value;

      // Construct DTO
      let agreementModel: AggrementDto = {
        aggrementTitle: formValues.aggrementTitle, 
        customerId: formValues.customerId,
        aggrementType: formValues.aggrementType,
        agreedAmount: formValues.agreedAmount,
        expirationDate: formValues.expirationDate,
        
        // Default backend values
        paidAmount: 0,
        billings: [],
        isActive: true
      };

      this.agreementService.addAggrement(agreementModel, () => {
        this.dialogRef.close(true);
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}