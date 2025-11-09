
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
  selector: 'add-duty-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,NgSelectModule],
  template: `

  <style>
  /* === Modern ng-select theme === */
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

/* Placeholder */
::ng-deep .ng-select .ng-placeholder {
  color: #adb5bd;
  font-weight: 400;
}

/* Selected value */
::ng-deep .ng-select .ng-value {
  color: #212529;
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

/* Dropdown items */
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

/* Clear button (x) */
::ng-deep .ng-select .ng-clear-wrapper {
  color: #adb5bd;
  transition: color 0.15s ease-in-out;
}
::ng-deep .ng-select .ng-clear-wrapper:hover {
  color: #dc3545;
}

/* Small fade-in animation for dropdown */
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
            <label class="form-label">{{ lang.name }}</label>
            <input formControlName="name" class="form-control" type="text">
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ lang.description }}</label>
            <input formControlName="description" class="form-control" type="text">
          </div>

           <div class="col-lg-6 mb-2">
                            <label class="chooseLabel">
                                <i class="fa-solid fa-user"></i> Müşteri Adı
                            </label>
                            <ng-select [items]="customers" bindLabel="companyName" bindValue="id"
                                formControlName="customerId"></ng-select>
                        </div>

          <div class="col-md-6">
            <label class="form-label">{{ 'Atanacak Personel' }}</label>
            <select class="form-select" formControlName="assignedEmployeeId">
              <option value="" disabled selected>{{ 'Personel Seç' }}</option>
              <option *ngFor="let e of employees" [value]="e.id">{{ e.firstName }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ "Görev Günü"}}</label>
            <input formControlName="deadline" class="form-control" type="date">
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ lang.priority }}</label>
            <select class="form-select" formControlName="priority">
              <option value="" disabled selected>Öncelik Seçin</option>
              <option value="Düşük">Düşük</option>
              <option value="Orta">Orta</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Acil">Acil</option>
            </select>
          </div>
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
export class AddDutyDialogComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  dutyForm!: FormGroup;
  customers: any[] = [];
  employees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private customerSvc: CustomerComponentService,
    private userSvc: UserComponentService,
    private dialogRef: MatDialogRef<AddDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { presetDate?: string } // optional date from calendar
  ) {}

  async ngOnInit() {
    this.dutyForm = this.fb.group({
      name: [''],
      description: [''],
      customerId: [''],
      deadline: [this.data?.presetDate ?? ''],
      status: ['Tamamlanmamış'],
      assignedEmployeeId: [''],
      priority: [''],
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
