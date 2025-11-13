import { addHours, format } from 'date-fns';
import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ILanguage } from '../../../../../assets/locales/ILanguage';
import { Languages } from '../../../../../assets/locales/language';

import { CustomerComponentService } from '../../../../services/component/customer-component.service';
import { UserComponentService } from '../../../../services/component/user/user-component.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { start } from 'repl';
import { SignaturePad, SignaturePadModule } from 'angular-signature-pad-v2';


@Component({
  selector: 'app-add-service-duty-dialog',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,NgSelectModule,SignaturePadModule],
  templateUrl: './add-service-duty-dialog.component.html',
  styleUrl: './add-service-duty-dialog.component.css'
})

export class AddServiceDutyDialogComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  dutyForm!: FormGroup;
  customers: any[] = [];
  employees: any[] = [];
  signatureBase64 = '';


     @ViewChild(SignaturePad) signaturePad: SignaturePad;
  
     signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
      'minWidth': 20,
      'canvasWidth': 550,
      'canvasHeight':300,
      
    };

  constructor(
    private fb: FormBuilder,
    private customerSvc: CustomerComponentService,
    private userSvc: UserComponentService,
    private dialogRef: MatDialogRef<AddServiceDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { presetDate?: string } // optional date from calendar
  ) { }
  async ngOnInit() {
    const today = format(new Date(), 'yyyy-MM-dd');
    

    
    this.dutyForm = this.fb.group({

         name: [''],
      description: [''],
      customerId: [''],
      deadline: [today],
      status: ['Tamamlanmamış'],
      // beginsAt: [today],
      // endsAt: [addHours(today,1)],
      assignedEmployeeId: [localStorage.getItem('userId')],
      priority: ['Orta'],
      signatureBase64:['']
    });

    this.customers = await this.customerSvc.getAllCustomer();
    this.employees = await this.userSvc.getAllUser();
  }

  submit() {
     if (this.dutyForm.valid) {
      this.dutyForm.patchValue({
        signatureBase64: this.signatureBase64
      });
      this.close(this.dutyForm.value);
    }
  }


ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    this.signatureBase64 = this.signaturePad.toDataURL();
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  clearPad() {
    this.signaturePad.clear();
  }

  close(result: any) { this.dialogRef.close(result); }
}