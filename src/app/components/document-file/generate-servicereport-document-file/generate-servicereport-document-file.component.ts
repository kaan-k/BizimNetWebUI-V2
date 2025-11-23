import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { DutyComponentService } from '../../../services/component/duty-component.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // <--- Import This

@Component({
  selector: 'app-generate-servicereport-document-file',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, MatDialogModule],
  templateUrl: './generate-servicereport-document-file.component.html',
  styleUrl: './generate-servicereport-document-file.component.css'
})
export class GenerateServicereportDocumentFileComponent implements OnInit {
  customers: any[] = [];
  serviceReportForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    // Inject DialogRef so we can close ourselves
    public dialogRef: MatDialogRef<GenerateServicereportDocumentFileComponent>,
    private toastrService: ToastrService,
    private customerComponentService: CustomerComponentService,
    private dutyComponentService: DutyComponentService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getCustomers();
    this.createDutyForm();
  }

  async getCustomers() {
    this.customers = await this.customerComponentService.getAllCustomer();
  }

  createDutyForm() {
    this.serviceReportForm = this.formBuilder.group({
      customerId: [null, Validators.required],
    });
  }

  createReport() {
    if (this.serviceReportForm.invalid) {
      this.toastrService.warning("Lütfen bir müşteri seçiniz.");
      this.serviceReportForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const customerId = this.serviceReportForm.value.customerId;
    
    this.dutyComponentService.getAllById(customerId)
      .then(reportData => {
        this.toastrService.success("Servis Raporu Başlatıldı.");
        this.isLoading = false;
        
        // CLEAN CLOSE: Return true to parent to indicate success
        this.dialogRef.close(true); 
      })
      .catch(error => {
        this.isLoading = false;
        this.toastrService.error("Veri alınamadı.");
      });
  }

  close() {
    this.dialogRef.close(false);
  }
}