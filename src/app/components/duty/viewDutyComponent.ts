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

@Component({
  selector: 'view-duty',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ lang.view }} - {{ data.name }}</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.customerName }}</mat-label>
        <input matInput [value]="data.customerId" readonly />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.name }}</mat-label>
        <input matInput [value]="data.name" readonly />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.description }}</mat-label>
        <textarea matInput [value]="data.description" readonly></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.deadline }}</mat-label>
        <input matInput [value]="data.deadline | date:'medium'" readonly />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ lang.priority }}</mat-label>
        <input matInput [value]="data.priortiy"  />
      </mat-form-field>
    </div>
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
export class ViewDutyComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(@Inject(MAT_DIALOG_DATA) public data: Duty) {}
}
