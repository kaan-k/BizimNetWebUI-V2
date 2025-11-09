import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DailyReportService } from '../../../services/common/dailyreport.service'
import { CustomerComponentService } from '../../../services/component/customer-component.service'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DutyComponentService } from '../../../services/component/duty-component.service';


@Component({
  selector: 'app-generate-servicereport-document-file',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './generate-servicereport-document-file.component.html',
  styleUrl: './generate-servicereport-document-file.component.css'
})
export class GenerateServicereportDocumentFileComponent {
customers: any[] = [];
serviceReportForm:FormGroup
@Output() documentEvent = new EventEmitter<boolean>();

  constructor(
    private dailyreportService: DailyReportService,
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
    return this.customers = await this.customerComponentService.getAllCustomer();
  }
  onSubmit(): void {
    this.dailyreportService.add().subscribe({
      next: (res) => {
        this.toastrService.success('Günlük rapor üretildi');
        this.documentEvent.emit(true);
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error('Rapor üretilemedi');
      }
    });
  }
  createDutyForm() {
    this.serviceReportForm = this.formBuilder.group({
      customerId: [''],
    });
  }
  createReport() {
  if (this.serviceReportForm.valid) {
    // 1. Get the value of the customerId field from the form
    const customerId = this.serviceReportForm.value.customerId; 
    
    // 2. Log the value to check
    console.log('Calling service for Customer ID:', customerId); 

    // 3. Call the correct component service method with ONE argument and subscribe
    this.dutyComponentService.getAllById(customerId)
      .then(reportData => { // Use .then() because the component service returns a Promise
        // SUCCESS: Your job is done here!
        console.log("Service call successful. Data received:", reportData); 
        this.toastrService.success("Servis Raporu Başlatıldı.");

        // NOTE: The modal should be closed here if it's not closed by data-bs-dismiss="modal" on the button
        this.documentEvent.emit(true);
      })
      .catch(error => {
        // ERROR handling
        this.toastrService.error("Müşteri verisi getirilemedi.");
        console.error("Service Call Error:", error);
      });
  }
}

}
