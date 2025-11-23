import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DailyReportService } from '../../../services/common/dailyreport.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // Import Dialog

@Component({
  selector: 'app-generate-dailyreport-document-file',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './generate-dailyreport-document-file.component.html',
  styleUrl: './generate-dailyreport-document-file.component.css'
})
export class GenerateDailyreportDocumentFileComponent {
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<GenerateDailyreportDocumentFileComponent>,
    private dailyreportService: DailyReportService,
    private toastrService: ToastrService
  ) {}

  onSubmit(): void {
    this.isLoading = true;

    this.dailyreportService.add().subscribe({
      next: (res) => {
        this.toastrService.success('Günlük rapor başarıyla üretildi.');
        this.isLoading = false;
        // Close and return 'true' so parent knows to refresh
        this.dialogRef.close(true); 
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error('Rapor üretilemedi.');
        this.isLoading = false;
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}