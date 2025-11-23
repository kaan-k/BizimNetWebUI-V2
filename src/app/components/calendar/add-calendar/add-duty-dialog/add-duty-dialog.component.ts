import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';

// PrimeNG
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';

// Services
import { ILanguage } from '../../../../../assets/locales/ILanguage';
import { Languages } from '../../../../../assets/locales/language';
import { CustomerComponentService } from '../../../../services/component/customer-component.service';
import { UserComponentService } from '../../../../services/component/user/user-component.service';

@Component({
  selector: 'add-duty-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    NgSelectModule,
    CalendarModule,
  ],
  templateUrl: './add-duty-dialog.component.html',
  styleUrl: './add-duty-dialog.component.css'
})
export class AddDutyDialogComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  dutyForm!: FormGroup;
  customers: any[] = [];
  employees: any[] = [];

  constructor(
    private config: PrimeNGConfig,
    private fb: FormBuilder,
    private customerSvc: CustomerComponentService,
    private userSvc: UserComponentService,
    private dialogRef: MatDialogRef<AddDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { presetDate?: string }
  ) { }

  async ngOnInit() {
    // 1. Setup Turkish Locale
    this.config.setTranslation({
        dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
        dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
        dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
        monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
        today: 'Bugün',
        clear: 'Temizle',
        dateFormat: 'dd.mm.yy',
        weekHeader: 'Hf',
        firstDayOfWeek: 1
    });

    // 2. Setup Default Date
    let defaultDate = new Date();
    if (this.data?.presetDate) {
        defaultDate = new Date(this.data.presetDate);
        defaultDate.setHours(9, 0, 0, 0);
    } else {
        // Round to nearest 15 mins
        const coeff = 1000 * 60 * 15;
        defaultDate = new Date(Math.round(defaultDate.getTime() / coeff) * coeff);
    }

    // 3. Init Form
    this.dutyForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      customerId: [null, Validators.required],
      assignedEmployeeId: ['', Validators.required],
      priority: ['Orta'],
      beginsAt: [defaultDate, Validators.required],
      endsAt: [null], 
    });

    // 4. Load Data
    const [cust, emp] = await Promise.all([
        this.customerSvc.getAllCustomer(),
        this.userSvc.getAllUser()
    ]);
    this.customers = cust;
    this.employees = emp;
  }

  submit() {
    if (this.dutyForm.valid) {
      // --- SUCCESS ---
      const formValue = this.dutyForm.value;

      // FIX: Ensure Dates are sent correctly (handle Timezone offset manually)
      // This prevents the backend from receiving a UTC time (3 hours behind)
      const result = {
        ...formValue,
        beginsAt: this.toLocalISOString(formValue.beginsAt),
        endsAt: formValue.endsAt ? this.toLocalISOString(formValue.endsAt) : null
      };

      this.close(result);

    } else {
      // --- FAILURE: Show user what is wrong ---
      this.dutyForm.markAllAsTouched();
      
      const invalidFields = [];
      Object.keys(this.dutyForm.controls).forEach(key => {
        if (this.dutyForm.get(key)?.invalid) {
            // Translate key to human readable if possible
            let label = key;
            if(key === 'name') label = 'Görev Başlığı';
            if(key === 'customerId') label = 'Müşteri';
            if(key === 'assignedEmployeeId') label = 'Personel';
            invalidFields.push(label);
        }
      });

      alert(`Lütfen zorunlu alanları doldurunuz:\n- ${invalidFields.join('\n- ')}`);
    }
  }

  // Helper to convert Date -> "2025-11-23T14:30:00" (Local Time, not UTC)
  private toLocalISOString(date: Date): string {
    if (!date) return null;
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1);
    return localISOTime;
  }

  close(result: any) { 
    this.dialogRef.close(result); 
  }
}