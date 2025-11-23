import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Duty } from '../../../../models/duties/duty';
import { ILanguage } from '../../../../../assets/locales/ILanguage';
import { Languages } from '../../../../../assets/locales/language';
import { DutyComponentService } from '../../../../services/component/duty-component.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'view-duty-calendar-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './add-calendar-duty-details-dailog.component.html',
  styleUrl: './add-calendar-duty-details-dailog.component.css',
})
export class AddCalendarViewDutyComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  showImage: boolean = true; // Default to showing signature if present

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Duty,
    public dialogRef: MatDialogRef<AddCalendarViewDutyComponent>,
    private dutyComponentService: DutyComponentService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {}

  toggleImage() {
    this.showImage = !this.showImage;
  }

  async markAsCompleted(id: string) {
    try {
      const res = await this.dutyComponentService.markAsCompleted(id);
      if (res.success) {
        this.toastrService.success(res.message);
        this.data.status = 'Tamamlandı';
        this.data.completedAt = new Date();
      } else {
        this.toastrService.error(res.message);
      }
    } catch {
      this.toastrService.error('Hata oluştu.');
    }
  }

  close() {
    this.dialogRef.close();
  }
}