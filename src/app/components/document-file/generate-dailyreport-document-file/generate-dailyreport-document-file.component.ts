import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DailyReportService } from '../../../services/common/dailyreport.service';

@Component({
  selector: 'app-generate-dailyreport-document-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generate-dailyreport-document-file.component.html',
  styleUrls: ['./generate-dailyreport-document-file.component.css']
})
export class GenerateDailyreportDocumentFileComponent {
  @Output() documentEvent = new EventEmitter<boolean>();

  constructor(
    private dailyreportService: DailyReportService,
    private toastrService: ToastrService
  ) {}

  onSubmit(): void {
    this.dailyreportService.add().subscribe({
      next: (res) => {
        this.toastrService.success('Günlük rapor üretildi');
        this.documentEvent.emit(true);
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error('Rapor üretilemedi');
      }
    });
  }
}
