import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { Customer } from '../../../models/customers/cusotmers';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-offer',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './update-offer.component.html',
  styleUrl: './update-offer.component.css'
})
export class UpdateOfferComponent {

  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng")); 
    offerForm:FormGroup
    @Input() set offer(value: any) {
      if(!value)return;
      this.updateOfferForm(value);
    }
    customers:Customer[];
    @Output() offerEvent = new EventEmitter<any>();
    constructor(private offerComponentService:OfferComponentService,private toastrService:ToastrService,private formBuilder:FormBuilder,private customerComponentService:CustomerComponentService) {}
  
    ngOnInit() {
      this.getAllCustomers();
    }
    updateOfferForm(value:any) {
      this.offerForm = this.formBuilder.group({
        customerId: [value.customerId],
        employeeId: [value.employeeId],
        offerTitle: [value.offerTitle],
        offerDetails: [value.offerDetails],
        rejectionReason: [value.rejectionReason],
        totalAmount: [value.totalAmount],
        status: [value.status], 
        id: [value.id],
        createdAt: [value.createdAt],
        updatedAt: [value.updatedAt],
      });
    }
  
    updateOffer(){
      if (this.offerForm.valid) {
        const model = Object.assign({}, this.offerForm.value)
        console.log(model);
        if (model.offerTitle.trim() == '') {
          this.toastrService.error(this.lang.pleaseFillİnformation)
          return
        }
        this.offerComponentService.updateOffer(model, () => {
          this.offerEvent.emit(true)
        })
      } else {
        this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
      }
    }
    async getAllCustomers(){
      return this.customers= await this.customerComponentService.getAllCustomer();
    }

}
