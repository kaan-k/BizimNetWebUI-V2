// view-duty.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Duty } from '../../../models/duties/duty'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

@Component({
  selector: 'view-duty-calendar-dialog',
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
        <mat-label>{{ lang.priority }}</mat-label>
        <input matInput [value]="data.priority"  />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ "Durum"}}</mat-label>
        <input matInput [value]="data.status"  />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ "Tamamlanma Zamanı" }}</mat-label>
        <input matInput [value]="data.completedAt |date:'d MMMM y HH:mm':'':'tr-TR'"
        placeholder="Henüz tamamlanmamış!" readonly />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ "Atanan Personel"}}</mat-label>
        <input matInput [value]="data.assignedEmployeeId"  />
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close class="button-4">
        <i class="fa-solid fa-circle-xmark"></i> {{"Kapat" }}
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
      padding-top:10px;
    }
  `]
})
export class AddCalendarViewDutyComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(@Inject(MAT_DIALOG_DATA) public data: Duty) {}
}
