import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { Customer } from '../../../models/customers/cusotmers';
import { Offer } from '../../../models/offers/offer';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { InstallationRequestComponentService } from '../../../services/component/installation-request-component.service';

@Component({
  selector: 'app-update-installation-request',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './update-installation-request.component.html',
  styleUrl: './update-installation-request.component.css'
})
export class UpdateInstallationRequestComponent {
lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  installationRequestForm: FormGroup;
  @Output() InstallationRequestEvent = new EventEmitter<any>();
  @Input() set installationRequest(value: any) {
    if (!value) return;
    this.updateInstallationRequestForm(value);
  }
  offers: Offer[]
  customers: Customer[]

  constructor(private InstallationRequestComponentService: InstallationRequestComponentService, private formBuilder: FormBuilder, private toastrService: ToastrService, private customerComponentService: CustomerComponentService, private offerComponentService: OfferComponentService) { }

  ngOnInit() {
    this.getOffers();
    this.getCustomers(); 
  }

  updateInstallationRequestForm(value: any) {
    this.installationRequestForm = this.formBuilder.group({
      id: [value.id],
      offerId: [value.offerId],
      customerId: [value.customerId],
      assignedEmployeeId: [value.assignedEmployeeId],
      isAssigned: [value.isAssigned],
      isCompleted: [value.isCompleted],
      installationNote: [value.installationNote],
      createdAt: [value.createdAt], 
    });
  }

  updateInstallationRequest() {
    debugger
    if (this.installationRequestForm.valid) {
      const model = Object.assign({}, this.installationRequestForm.value)
      this.InstallationRequestComponentService.updateInstallationRequest(model, () => {
        this.InstallationRequestEvent.emit(true) 
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }
  async getOffers() {
    return this.offers = await this.offerComponentService.getAllOffer();
  }
  async getCustomers() {
    return this.customers = await this.customerComponentService.getAllCustomer();
  }
}
