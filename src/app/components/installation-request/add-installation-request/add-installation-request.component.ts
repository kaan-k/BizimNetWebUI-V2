import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { InstallationRequestComponentService } from '../../../services/component/installation-request-component.service';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { Offer } from '../../../models/offers/offer';
import { Customer } from '../../../models/customers/cusotmers';

@Component({
  selector: 'app-add-installation-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-installation-request.component.html',
  styleUrl: './add-installation-request.component.css'
})
export class AddInstallationRequestComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  installationRequestForm: FormGroup;
  @Output() InstallationRequestEvent = new EventEmitter<any>();
  offers: Offer[]
  customers: Customer[]

  constructor(private InstallationRequestComponentService: InstallationRequestComponentService, private formBuilder: FormBuilder, private toastrService: ToastrService, private customerComponentService: CustomerComponentService, private offerComponentService: OfferComponentService) { }

  ngOnInit() {
    this.getOffers();
    this.getCustomers();
    this.createInstallationRequestForm();
  }

  createInstallationRequestForm() {
    this.installationRequestForm = this.formBuilder.group({
      offerId: [''],
      customerId: [''],
      assignedEmployeeId: [''],
      isAssigned: [false],
      isCompleted: [false],
      installationNote: [''],
    });
  }

  addInstallationRequest() {
    debugger
    if (this.installationRequestForm.valid) {
      const model = Object.assign({}, this.installationRequestForm.value)
      this.InstallationRequestComponentService.addInstallationRequest(model, () => {
        this.InstallationRequestEvent.emit(true)
        this.createInstallationRequestForm()
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
