// navbar-document-file.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Languages } from '../../../../assets/locales/language';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { DailyReportService } from '../../../services/common/dailyreport.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar-document-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-document-file.component.html',
  styleUrls: ['./navbar-document-file.component.css']   // styleUrls dikkat
})
export class NavbarDocumentFileComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(
    private dailyReportService: DailyReportService,
    private toastr: ToastrService
  ) {}

 
}
