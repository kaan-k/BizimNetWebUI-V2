import { Injectable } from '@angular/core';
import { ServicingService } from '../common/servicing.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Servicing } from '../../models/servicing/servicing';

@Injectable({
  providedIn: 'root'
})
export class ServicingComponentService {

  constructor(private servicingService: ServicingService, private toastrService: ToastrService) { }

  async getAllServicing() {
    const observable = this.servicingService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async markAsCompleted(id: string) {
    const observable = this.servicingService.markAsCompleted(id)
    return (await firstValueFrom(observable)).data
  }
  async markAsInProgress(id: string) {
    const observable = this.servicingService.markAsInProgress(id)
    return (await firstValueFrom(observable)).data
  }
  async getById(id: string) {
    const observable = this.servicingService.getById(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteServicing(id: string, callBackfunction?: () => void) {
    const observable = await this.servicingService.deleteServicing(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async addServicing(Servicing: Servicing, callBackfunction?: () => void) {
    const observable = await this.servicingService.addServicing(Servicing)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateServicing(Servicing: Servicing, callBackfunction?: () => void) {
    const observable = await this.servicingService.updateServicing(Servicing)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
}
