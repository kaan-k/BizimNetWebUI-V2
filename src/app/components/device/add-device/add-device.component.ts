import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { DeviceComponentService } from '../../../services/component/device-component.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../../models/customers/cusotmers';
import { CustomerComponentService } from '../../../services/component/customer-component.service';

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.css'
})
export class AddDeviceComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  deviceForm: FormGroup;
  customers: Customer[];
  @Output() deviceEvent = new EventEmitter<any>();
  constructor(private deviceComponentService: DeviceComponentService, private toastrService: ToastrService, private formBuilder: FormBuilder, private customerComponentService: CustomerComponentService) { }

  ngOnInit() {
    this.getAllCustomers();
    this.createDeviceForm();
  }
  createDeviceForm() {
    this.deviceForm = this.formBuilder.group({
      name: [''],
      deviceType: [''],
      customerId: [''],
      anyDeskId: [''],
      publicIp: ['']
    });
  }

  async getAllCustomers() {
    return this.customers = await this.customerComponentService.getAllCustomer();
  }
  addDevice() {
    if (this.deviceForm.valid) {
      const model = Object.assign({}, this.deviceForm.value)
      this.deviceComponentService.addDevice(model, () => {
        this.deviceEvent.emit(true)
        this.createDeviceForm()
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }

}
