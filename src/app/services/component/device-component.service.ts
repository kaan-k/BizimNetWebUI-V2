import { Injectable } from '@angular/core';
import { DeviceService } from '../common/device.service';
import { ToastrService } from 'ngx-toastr';
import { Device } from '../../models/devices/device';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceComponentService {

  constructor(private deviceService: DeviceService, private toastrService: ToastrService) { }
  async getAllDevice() {
    const observable = this.deviceService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async getById(id: string) {
    const observable = this.deviceService.getById(id)
    return (await firstValueFrom(observable)).data
  }
  async getAllByCustomerId(id: string) {
    const observable = this.deviceService.getAllByCustomerId(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteDevice(id: string, callBackfunction?: () => void) {
    const observable = await this.deviceService.deleteDevice(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async addDevice(Device: Device, callBackfunction?: () => void) {
    const observable = await this.deviceService.addDevice(Device)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateDevice(Device: Device, callBackfunction?: () => void) {
    const observable = await this.deviceService.updateDevice(Device)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
}
