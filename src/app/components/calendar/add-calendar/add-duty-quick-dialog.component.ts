import { format } from 'date-fns';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { UserComponentService } from '../../../services/component/user/user-component.service';

@Component({
  selector: 'add-duty-quick-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title><i class="fa-solid fa-plus"></i> {{ lang.addNewDuty }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="dutyForm">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">{{lang.name }}</label>
            <input formControlName="name" class="form-control" type="text">
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ lang.description }}</label>
            <input formControlName="description" class="form-control" type="text">
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ lang.customerName }}</label>
            <select class="form-select" formControlName="customerId">
              <option value="" disabled selected>{{ lang.chooseCustomers }}</option>
              <option *ngFor="let c of customers" [value]="c.id">{{ c.companyName }}</option>
            </select>
          </div>

          <!-- <div class="col-md-6">
            <label class="form-label">{{ 'Atanacak Personel' }}</label>
            <select class="form-select" formControlName="assignedEmployeeId">
              <option value="" disabled selected>{{ 'Personel Seç' }}</option>
              <option *ngFor="let e of employees" [value]="e.id">{{ e.firstName }}</option>
            </select>
          </div> -->

          <!-- <div class="col-md-6">
            <label class="form-label">{{ "Görev Günü" }}</label>
            <input formControlName="deadline" class="form-control" type="date">
          </div> -->

          <!-- <div class="col-md-6">
            <label class="form-label">{{ lang.priority }}</label>
            <select class="form-select" formControlName="priority">
              <option value="" disabled selected>Öncelik Seçin</option>
              <option value="Düşük">Düşük</option>
              <option value="Orta">Orta</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Acil">Acil</option>
            </select>
          </div> -->
        </div>
      </form>
    </div>

    <div mat-dialog-actions class="d-flex justify-content-end gap-2">
      <button class="button-4" mat-button (click)="close(null)">
        <i class="fa-solid fa-circle-xmark"></i> {{ lang.cancel }}
      </button>
      <button class="button-24" mat-button (click)="submit()">
        <i class="fa-solid fa-check"></i> {{ lang.addNewDuty }}
      </button>
    </div>
  `,
})
export class AddDutyQuickDialogComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  dutyForm!: FormGroup;
  customers: any[] = [];
  employees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private customerSvc: CustomerComponentService,
    private userSvc: UserComponentService,
    private dialogRef: MatDialogRef<AddDutyQuickDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { presetDate?: string } // optional date from calendar
  ) {}
  async ngOnInit() {
    const today = format(new Date(), 'yyyy-MM-dd');

    this.dutyForm = this.fb.group({
        
      name: [''],
      description: [''],
      customerId: [''],
      deadline: [today],
      status: ['Tamamlanmamış'],
      assignedEmployeeId: [localStorage.getItem('userId')],
      priority: ['Orta'],
    });

    this.customers = await this.customerSvc.getAllCustomer();
    this.employees = await this.userSvc.getAllUser();
  }

  submit() {
    if (this.dutyForm.valid) {
      this.close(this.dutyForm.value);
    }
  }
  close(result: any) { this.dialogRef.close(result); }
}
