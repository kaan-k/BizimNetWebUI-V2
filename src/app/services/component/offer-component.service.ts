import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Offer } from '../../models/offers/offer';
import { firstValueFrom } from 'rxjs';
import { OfferService } from '../common/offer.service';

@Injectable({
  providedIn: 'root'
})
export class OfferComponentService {

  constructor(private offerService: OfferService, private toastrService: ToastrService) { }

  async getAllOffer() {
    const observable = this.offerService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async getById(id: string) {
    const observable = this.offerService.getById(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteOffer(id: string, callBackfunction?: () => void) {
    const observable = await this.offerService.deleteOffer(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async addOffer(Offer: Offer, callBackfunction?: () => void) {
    const observable = await this.offerService.addOffer(Offer)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateOffer(Offer: Offer, callBackfunction?: () => void) {
    const observable = await this.offerService.updateOffer(Offer)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async approve(id: string) {
    const observable = this.offerService.approve(id)
    return (await firstValueFrom(observable)).data
  }
  async reject(id: string, reason: string) {
    const observable = this.offerService.reject(id, reason)
    return (await firstValueFrom(observable)).data
  }
}
