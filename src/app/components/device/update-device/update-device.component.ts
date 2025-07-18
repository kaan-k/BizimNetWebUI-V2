import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { Customer } from '../../../models/customers/cusotmers';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { DeviceComponentService } from '../../../services/component/device-component.service';

@Component({
  selector: 'app-update-device',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './update-device.component.html',
  styleUrl: './update-device.component.css'
})
export class UpdateDeviceComponent {
lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  deviceForm: FormGroup;
  customers: Customer[];
  @Output() deviceEvent = new EventEmitter<any>();
  @Input() set device(value: any) {
    if(!value)return;
    console.log(value);
    
    this.updateDeviceForm(value);
  }
  constructor(private deviceComponentService: DeviceComponentService, private toastrService: ToastrService, private formBuilder: FormBuilder, private customerComponentService: CustomerComponentService) { }
 
  updateDeviceForm(value?:any) {
    this.deviceForm = this.formBuilder.group({
      name: [value.name],
      deviceType: [value.deviceType],
      customerId: [value.customerId],
      anyDeskId: [value.anyDeskId],
      publicIp: [value.publicIp],
      createdAt: [value.createdAt],
      updatedAt: [value.updatedAt],
    });
  }
  ngOnInit() {
    this.getAllCustomers();
  }

  async getAllCustomers() {
    return this.customers = await this.customerComponentService.getAllCustomer();
  }
  updateDevice() {
    if (this.deviceForm.valid) {
      const model = Object.assign({}, this.deviceForm.value)
      this.deviceComponentService.updateDevice(model, () => {
        this.deviceEvent.emit(true) 
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }
}
