import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { Customer } from '../../../models/customers/cusotmers';

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-offer.component.html',
  styleUrl: './add-offer.component.css'
})
export class AddOfferComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng")); 
  offerForm:FormGroup
  customers:Customer[];
  @Output() offerEvent = new EventEmitter<any>();
  constructor(private offerComponentService:OfferComponentService,private toastrService:ToastrService,private formBuilder:FormBuilder,private customerComponentService:CustomerComponentService) {}

  ngOnInit() {
    this.getAllCustomers();
    this.createOfferForm();
  }
  createOfferForm() {
    this.offerForm = this.formBuilder.group({
      customerId: [''],
      employeeId: [''],
      offerTitle: [''],
      offerDetails: [''],
      rejectionReason: [''],
      totalAmount: [''],
      status: [''], 
    });
  }

  addOffer(){
    if (this.offerForm.valid) {
      const model = Object.assign({}, this.offerForm.value)
      console.log(model);
      if (model.offerTitle.trim() == '') {
        this.toastrService.error(this.lang.pleaseFillİnformation)
        return
      }
      this.offerComponentService.addOffer(model, () => {
        this.offerEvent.emit(true)
        this.createOfferForm()
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }
  async getAllCustomers(){
    return this.customers= await this.customerComponentService.getAllCustomer();
  }
}
