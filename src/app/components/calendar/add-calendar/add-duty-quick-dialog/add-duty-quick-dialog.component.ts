import { addHours, format } from 'date-fns';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ILanguage } from '../../../../../assets/locales/ILanguage';
import { Languages } from '../../../../../assets/locales/language';

import { CustomerComponentService } from '../../../../services/component/customer-component.service';
import { UserComponentService } from '../../../../services/component/user/user-component.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { start } from 'repl';

@Component({
  selector: 'add-duty-quick-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,NgSelectModule],
    templateUrl: './add-duty-quick-dialog.component.html',
  styleUrl: './add-duty-quick-dialog.component.css'  
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
    const today = format(new Date(), 'yyyy-MM-dd');

    
    this.dutyForm = this.fb.group({

         name: [''],
      description: [''],
      customerId: [''],
      deadline: [today],
      status: ['Tamamlanmamış'],
      // beginsAt: [today],
      // endsAt: [addHours(today,1)],
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
