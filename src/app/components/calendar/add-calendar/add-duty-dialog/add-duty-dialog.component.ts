
import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ILanguage } from '../../../../../assets/locales/ILanguage';
import { Languages } from '../../../../../assets/locales/language';
import { SignaturePadModule } from 'angular-signature-pad-v2';
import { SignaturePad } from 'angular-signature-pad-v2';

import { CustomerComponentService } from '../../../../services/component/customer-component.service';
import { UserComponentService } from '../../../../services/component/user/user-component.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'add-duty-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, NgSelectModule,SignaturePadModule ],
  templateUrl: './add-duty-dialog.component.html',
  styleUrl: './add-duty-dialog.component.css'  
})
export class AddDutyDialogComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  dutyForm!: FormGroup;
  customers: any[] = [];
  employees: any[] = [];
   @ViewChild(SignaturePad) signaturePad: SignaturePad;

   signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 250,
    'canvasHeight': 100,
    
  };
refresh = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private customerSvc: CustomerComponentService,
    private userSvc: UserComponentService,
    private dialogRef: MatDialogRef<AddDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { presetDate?: string } // optional date from calendar
  ) { }

  async ngOnInit() {
    this.dutyForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      customerId: [''],
      deadline: [this.data?.presetDate ?? ''],
      beginsAt: [''],
      endsAt: [''],
      status: ['Tamamlanmamış'],
      assignedEmployeeId: [''],
      priority: [''],
    });

    this.customers = await this.customerSvc.getAllCustomer();
    this.employees = await this.userSvc.getAllUser();
  }

    ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  clearPad() {
    this.signaturePad.clear();
  }

  submit() {
    if (this.dutyForm.valid) {
      this.close(this.dutyForm.value);
      this.refresh.next();
    }
    else {

    }
  }
  close(result: any) { this.dialogRef.close(result); }
}
