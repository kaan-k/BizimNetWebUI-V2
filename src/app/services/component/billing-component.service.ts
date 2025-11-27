import { Injectable } from '@angular/core';
import { BillingService } from '../common/billing.service'; // Adjust path if needed
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Billing } from '../../models/billings/billing';
import { BillingDto } from '../../models/billings/billingDto';
import { ResponseModel } from '../../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class BillingComponentService {

  constructor(private billingService: BillingService, private toastrService: ToastrService) { }

  async getAll() {
    const observable = this.billingService.getAll();
    const response = await firstValueFrom(observable);
    return response.data;
  }

  async getById(id: string) {
    const observable = this.billingService.getById(id);
    return (await firstValueFrom(observable)).data;
  }

  async delete(id: string, callBackfunction?: () => void) {
    // We do NOT await here, because deleteBilling returns an Observable, not a Promise
    const observable = this.billingService.deleteBilling(id);
    
    // We convert Observable to Promise here
    const promiseData = firstValueFrom(observable) as Promise<ResponseModel>;
    
    promiseData.then(response => {
      this.toastrService.success(response.message);
      callBackfunction && callBackfunction();
    }).catch(error => {
      // Handle backend error messages if they exist
      if(error.error && error.error.message) {
        this.toastrService.error(error.error.message);
      } else {
        this.toastrService.error("Bir hata oluştu.");
      }
    });
  }

  async add(billing: BillingDto, callBackfunction?: () => void) {
    const observable = this.billingService.add(billing);
    const promiseData = firstValueFrom(observable) as Promise<ResponseModel>;
    
    promiseData.then(response => {
      this.toastrService.success(response.message);
      callBackfunction && callBackfunction();
    }).catch(error => {
       this.toastrService.error(error.error);
    });
  }

  async update(billing: Billing, id: string, callBackfunction?: () => void) {
    const observable = this.billingService.update(billing, id);
    const promiseData = firstValueFrom(observable) as Promise<ResponseModel>;
    
    promiseData.then(response => {
      this.toastrService.success(response.message);
      callBackfunction && callBackfunction();
    }).catch(error => {
      this.toastrService.error(error.error);
    });
  }

  async recievePay(billId: string, amount: number, callBackfunction?: () => void) {
    const observable = this.billingService.recievePay(billId, amount);
    const promiseData = firstValueFrom(observable) as Promise<ResponseModel>;
    
    promiseData.then(response => {
      this.toastrService.success(response.message);
      callBackfunction && callBackfunction();
    }).catch(error => {
      this.toastrService.error(error.error);
    });
  }
}