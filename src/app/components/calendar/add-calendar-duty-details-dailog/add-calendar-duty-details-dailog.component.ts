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
  templateUrl: './add-calendar-duty-details-dailog.component.html',
  styleUrl: './add-calendar-duty-details-dailog.component.css',
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


  async ngOnInit() {
    console.log(this.data.signatureBase64)
    
  }
  showImage: boolean = false;

toggleImage() {
  this.showImage = !this.showImage;
}
  getImageSrc(base64: string) {
  if (!base64) return '';
  
  if (base64.startsWith('data:')) {
    return base64;
  }
  
  return 'data:image/png;base64,' + base64;
}
}


