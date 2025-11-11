import { addHours, format } from 'date-fns';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { UserComponentService } from '../../../services/component/user/user-component.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'add-duty-quick-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,NgSelectModule],
  template: `
 <style>
/* === General Dialog Styling === */
:host ::ng-deep .mat-dialog-container {
  padding: 28px 36px !important;
  border-radius: 16px !important;
  background-color: #ffffff !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
}

/* Dialog title */
h2[mat-dialog-title] {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

h2[mat-dialog-title] i {
  color: #0d6efd;
}

/* Form layout */
:host ::ng-deep .mat-dialog-content {
  padding-top: 12px;
  max-height: 75vh;
  overflow-y: auto;
}

/* Label and input improvements */
.form-label,
.chooseLabel {
  font-weight: 600 !important;
  color: #444 !important;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.form-control,
.form-select,
::ng-deep .ng-select .ng-select-container {
  border-radius: 10px !important;
  font-size: 14px;
  padding: 8px 10px;
}

/* Larger row spacing for roomy layout */
.row.g-3 > div {
  margin-bottom: 12px;
}

/* === ng-select modernized === */
::ng-deep .ng-select {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

/* Container */
::ng-deep .ng-select .ng-select-container {
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 10px;
  min-height: 42px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

::ng-deep .ng-select:hover .ng-select-container {
  border-color: #86b7fe;
  box-shadow: 0 2px 5px rgba(13, 110, 253, 0.08);
}

::ng-deep .ng-select.ng-select-focused .ng-select-container {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
}

/* Dropdown panel */
::ng-deep .ng-dropdown-panel {
  background-color: #fff !important;
  border: 1px solid #dee2e6 !important;
  border-radius: 10px !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15) !important;
  margin-top: 4px;
  overflow: hidden;
  z-index: 9999 !important;
  animation: dropdownFadeIn 0.15s ease-in-out;
}

::ng-deep .ng-dropdown-panel .ng-option {
  background: #ffffff !important;
  color: #212529 !important;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

::ng-deep .ng-dropdown-panel .ng-option:hover {
  background-color: #f1f3f5 !important;
}

::ng-deep .ng-dropdown-panel .ng-option-selected {
  background-color: #e9f3ff !important;
  color: #0d6efd !important;
  font-weight: 500;
}

/* Buttons */
:host ::ng-deep .mat-dialog-actions {
  padding-top: 20px;
}

.button-4,
.button-24 {
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.button-4 {
  background-color: #f8f9fa;
  color: #333;
}

.button-4:hover {
  background-color: #e9ecef;
}

.button-24 {
  background-color: #28a745;
  color: white;
}

.button-24:hover {
  background-color: #218838;
  transform: translateY(-1px);
}

/* Small fade-in animation */
@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
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

           <div class="col-lg-12 mb-2">
                            <label class="chooseLabel">
                                <i class="fa-solid fa-user"></i> Müşteri Adı
                            </label>
                            <ng-select [items]="customers" bindLabel="companyName" bindValue="id"
                                formControlName="customerId"></ng-select>
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
  ) { }
  async ngOnInit() {
    const today = format(new Date(), 'yyyy-MM-dd-HH:mm-ss');

    this.dutyForm = this.fb.group({

      name: [''],
      description: [''],
      customerId: [''],
      deadline: [today],
      status: ['Tamamlanmamış'],
      endsAt: [addHours(today,1)],
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
