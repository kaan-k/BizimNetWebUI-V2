import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language'; 

@Component({
  selector: 'app-update-customer',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.css'
})
export class UpdateCustomerComponent {
lang:ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  customerForm:FormGroup;
  @Output() customerEvent = new EventEmitter<any>();
  @Input() set customer(value: any) {
    if(!value)return;
    console.log(value);
    
    this.updateCustomerForm(value);
  }

  constructor(private customerComponentService:CustomerComponentService,private formBuilder:FormBuilder,private toastrService:ToastrService){}


  updateCustomerForm(value?: any) {
    this.customerForm = this.formBuilder.group({
      id: [value.id],
      name: [value.name],
      companyName: [value.companyName],
      email: [value.email],
      phoneNumber: [value.phoneNumber],
      address: [value.address],
      country: [value.country],
      city: [value.city],
      customerField: [value.customerField],
      status: [value.status],
      createdAt:[value.createdAt],
      updatedAt:[value.updatedAt],
      lastActionDate:[value.lastActionDate],
      lastAction:[value.lastAction]
    });
  }

  updateCustomer(){
    if (this.customerForm.valid) {
      const model = Object.assign({}, this.customerForm.value)
      model.phoneNumber = model.phoneNumber.toString()
      console.log(model);
      
      if (model.email.trim() == '') {
        this.toastrService.error(this.lang.pleaseFillİnformation)
        return
      }
      this.customerComponentService.updateCustomer(model, () => {
        this.customerEvent.emit(true)
        this.customerForm.reset();
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }
}
