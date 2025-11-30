import { Injectable } from '@angular/core';
import { CustomerService } from '../common/customer.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Customer } from '../../models/customers/cusotmers';
import { CustomerDto } from '../../models/customers/customerDto';

@Injectable({
  providedIn: 'root'
})
export class CustomerComponentService {

  constructor(private customerService: CustomerService, private toastrService: ToastrService) { }
  async getAllCustomer() {
    const observable = this.customerService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async getById(id: string) {
    const observable = this.customerService.getById(id)
    return (await firstValueFrom(observable)).data
  }
   async getAllByCustomerId(id: string) {
    const observable = this.customerService.getByAllById(id)
    return (await firstValueFrom(observable)).data
  }
     async getBranchByHqId(id: string) {
    const observable = this.customerService.getBranchByHqId(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteCustomer(id: string, callBackfunction?: () => void) {
    const observable = await this.customerService.deleteCustomer(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async addCustomer(customer: CustomerDto, callBackfunction?: () => void) {
    const observable = await this.customerService.addCustomer(customer)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateCustomer(customer: Customer, callBackfunction?: () => void) {
    const observable = await this.customerService.updateCustomer(customer)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
}
