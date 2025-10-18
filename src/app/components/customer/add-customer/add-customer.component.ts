import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  lang:ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  customerForm:FormGroup;
  @Output() customerEvent = new EventEmitter<any>();

  constructor(private customerComponentService:CustomerComponentService,private formBuilder:FormBuilder,private toastrService:ToastrService){}

  ngOnInit() {
    this.createCustomerForm();
  }

  createCustomerForm() {
    this.customerForm = this.formBuilder.group({
      name: [''],
      companyName: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      country: ['Türkiye'],
      taxid:[''],
      city: [''],
      customerField: [''],
      status: [''],
      createdAt:[new Date()],
      updatedAt:[new Date()],
      lastActionDate:[new Date()],
      lastAction:['']
    });
  }

  addCustomer(){
    if (this.customerForm.valid) {
      const model = Object.assign({}, this.customerForm.value)
      model.phoneNumber = model.phoneNumber.toString()
      console.log(model);
      
      // if (model.email.trim() == '') {
      //   this.toastrService.error(this.lang.pleaseFillİnformation)
      //   return
      // }
      this.customerComponentService.addCustomer(model, () => {
        this.customerEvent.emit(true)
        this.createCustomerForm()
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }

}
