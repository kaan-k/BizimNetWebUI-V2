import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Languages } from '../../../../assets/locales/language';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { DeviceComponentService } from '../../../services/component/device-component.service';
import { ServicingComponentService } from '../../../services/component/servicing-component.service';
import { ToastrService } from 'ngx-toastr';
import { Device } from '../../../models/devices/device';
declare var $: any;

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.css'
})
export class AddDeviceComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  serviceForm: FormGroup;
  @Output() deviceEvent = new EventEmitter<any>();
  selectedDevices: Device[] = [];
  selectedDeviceIds: string[] = [];
  devices: Device[];
  @Input() set device(value: any) {
    if (!value) return;
    this.updateServiceForm(value);
    this.getAllDevices(value);
  }

  constructor(private formBuilder: FormBuilder,private deviceComponentService: DeviceComponentService,private servicingComponentService: ServicingComponentService,private toastrService:ToastrService) {}

  updateServiceForm(value?: any) {
    this.serviceForm = this.formBuilder.group({
      id: [value.id],
      name: [value.name],
      customerId: [value.customerId],
      deviceIds: [[]],
      status: [value.status],
      createdAt: [value.createdAt],
      updatedAt: [value.updatedAt],
      lastActionDate: [value.lastActionDate],
      lastAction: [value.lastAction],
    });
  }
  async getAllDevices(value: any) {
    this.devices = await this.deviceComponentService.getAllByCustomerId(value.customerId); 
    this.selectedDeviceIds =value.deviceIds
    this.selectedDeviceIds.forEach(element => {
      this.selectedDevices.push(this.devices.find(device => device.id === element));
      this.devices = this.devices.filter(device => device.id !== element);
    }); 
    
    
  }
  addDeviceId() {
    const id = this.serviceForm.get("deviceIds").value;
    debugger
    if (id && !this.selectedDeviceIds.includes(id)&&id.length>0) {
      this.selectedDeviceIds.push(id);
      const device = this.devices.find(d => d.id == id);
      if (device) {
        this.selectedDevices.push(device);
        this.devices = this.devices.filter(device => device.id !== id);
      }
      setTimeout(() => {
        this.serviceForm.get("deviceIds").setValue("");
      });
    }
  }

  removeDeviceId(deviceId: string) { 
    this.selectedDeviceIds = this.selectedDeviceIds.filter(id => id !== deviceId); 
    const device = this.selectedDevices.find(d => d.id == deviceId);
    if (device) {
      this.devices.push(device);
      this.selectedDevices = this.selectedDevices.filter(device => device.id !== deviceId);
    } 
     setTimeout(() => {
        this.serviceForm.get("deviceIds").setValue("");
      });
  }  
  updateDevice() {
    if (this.serviceForm.valid) {
      this.serviceForm.get("deviceIds").setValue(this.selectedDeviceIds);
      const model = Object.assign({}, this.serviceForm.value);
      this.servicingComponentService.updateServicing(model, () => {
        this.deviceEvent.emit(true);
        $('#servicingDeviceAddModal').modal('hide');
        this.selectedDeviceIds = [];
        this.selectedDevices = [];
      });
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error);
    }
  }

}
