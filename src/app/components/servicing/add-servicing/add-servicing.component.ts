import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Languages } from '../../../../assets/locales/language';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { ServicingComponentService } from '../../../services/component/servicing-component.service';
import { DeviceComponentService } from '../../../services/component/device-component.service';
import { ToastrService } from 'ngx-toastr';
import { Device } from '../../../models/devices/device';
import { Customer } from '../../../models/customers/cusotmers';  
import { CustomerComponentService } from '../../../services/component/customer-component.service';

@Component({
  selector: 'app-add-servicing',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-servicing.component.html',
  styleUrl: './add-servicing.component.css'
})
export class AddServicingComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  servicingForm: FormGroup;
  devices: Device[]; 
  customers: Customer[];
  selectedDeviceIds: string[] = [];
  selectDevices: Device[] = [];
  @Output() servicingEvent = new EventEmitter<any>(); 

  constructor( 
    private servicingComponentService: ServicingComponentService,
    private deviceComponentService: DeviceComponentService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private customerComponentService: CustomerComponentService
  ) {}

  ngOnInit() {
    this.createServicingForm();  
    this.getAllCustomers();
  }

  createServicingForm() {
    this.servicingForm = this.formBuilder.group({
      name: [""],
      customerId: [""],
      deviceIds: [[]], 
      status: [""],
    });
  }

  async onCustomerChange(event: any) {
    const id = event.target.value;
    this.devices = await this.deviceComponentService.getAllByCustomerId(id);
    this.selectedDeviceIds = [];
    this.selectDevices = [];
    this.servicingForm.get("deviceIds").setValue([]);
  }

  addDeviceId() {
    const id = this.servicingForm.get("deviceIds").value;
    if (id && !this.selectedDeviceIds.includes(id)) {
      this.selectedDeviceIds.push(id);
      const device = this.devices.find(d => d.id == id);
      if (device) {
        this.selectDevices.push(device);
        this.devices = this.devices.filter(device => device.id !== id);
      }
      this.servicingForm.get("deviceIds").setValue(this.selectedDeviceIds); 
      setTimeout(() => {
        this.servicingForm.get("deviceIds").setValue("");
      });
    }
  }

  removeDeviceId(deviceId: string) { 
    this.selectedDeviceIds = this.selectedDeviceIds.filter(id => id !== deviceId); 
    const device = this.selectDevices.find(d => d.id == deviceId);
    if (device) {
      this.devices.push(device);
      this.selectDevices = this.selectDevices.filter(device => device.id !== deviceId);
    } 
     setTimeout(() => {
        this.servicingForm.get("deviceIds").setValue("");
      });
  }  

  async getAllCustomers() {
    this.customers = await this.customerComponentService.getAllCustomer();
  }

  addServicing() {
    if (this.servicingForm.valid) {
      this.servicingForm.get("deviceIds").setValue(this.selectedDeviceIds);
      const model = Object.assign({}, this.servicingForm.value); 
      this.servicingComponentService.addServicing(model, () => {
        this.servicingEvent.emit(true);
        this.createServicingForm();
        this.selectedDeviceIds = [];
        this.selectDevices = [];
      });
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error);
    }
  }
}
