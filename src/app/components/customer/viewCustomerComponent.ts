// view-duty.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Duty } from '../../models/duties/duty'; 
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '../../models/customers/cusotmers';

@Component({
  selector: 'view-customer',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ lang.view }} - {{ data.companyName }}</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.customerName }}</mat-label>
        <input matInput [value]="data.companyName" readonly />
      </mat-form-field>


         <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.taxid }}</mat-label>
        <input matInput [value]="data.taxId" readonly />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.description }}</mat-label>
        <textarea matInput [value]="data.lastActionDate" readonly></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.phoneNumber }}</mat-label>
        <input matInput [value]="data.phoneNumber| date:'medium'" readonly />
      </mat-form-field>

    </div>
    <!-- {{ data | json }} -->
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close class="button-4">
        <i class="fa-solid fa-circle-xmark"></i> {{" lang.close" }}
      </button>
    </div>
  `,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
  `]
})
export class ViewCustomerComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(@Inject(MAT_DIALOG_DATA) public data: Customer) {}
}
