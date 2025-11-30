import { Injectable } from '@angular/core';
import { AggrementService } from '../common/aggrement.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Aggrement } from '../../models/aggrements/aggrement';
import { AggrementDto } from '../../models/aggrements/aggrementDto';

@Injectable({
  providedIn: 'root'
})
export class AggrementComponentService {

  constructor(private aggrementService: AggrementService, private toastrService: ToastrService) { }

  async getAllAggrement() {
    const observable = this.aggrementService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }

  async getById(id: string) {
    const observable = this.aggrementService.getById(id)
    return (await firstValueFrom(observable)).data
  }

  async deleteAggrement(id: string, callBackfunction?: () => void) {
    const observable = await this.aggrementService.deleteAggrement(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

    async createFromOffer(offerId: string, successCallBack?: () => void) {
    const observable = this.aggrementService.createFromOffer(offerId);
    const promiseData = firstValueFrom(observable);

    promiseData.then(response => {
      this.toastrService.success(response.message || "Sözleşme başarıyla oluşturuldu.", "Başarılı");
      successCallBack && successCallBack();
    }).catch(error => {
      console.error("Agreement Create Error:", error);
      this.toastrService.error(error.error?.message || "Sözleşme oluşturulurken bir hata oluştu.", "Hata");
    });
  }

  async addAggrement(aggrement: AggrementDto, callBackfunction?: () => void) {
    const observable = await this.aggrementService.addAggrement(aggrement)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

  async updateAggrement(aggrement: Aggrement, id: string, callBackfunction?: () => void) {
    const observable = await this.aggrementService.updateAggrement(aggrement, id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

  // Specific method for the RecieveBill action
  async recieveBill(aggrementId: string, amount: number, callBackfunction?: () => void) {
    const observable = await this.aggrementService.recieveBill(aggrementId, amount)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
}