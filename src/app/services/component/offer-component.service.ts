import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OfferDto } from '../../models/offers/offer';
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
  // async getById(id: string) {
  //   const observable = this.offerService.getById(id)
  //   return (await firstValueFrom(observable)).data
  // }

    async approve(id: string, successCallBack?: () => void) {
    // Calls the base service method you provided: 
    // approve(id: string) { const observable = this.get... }
    const observable = this.offerService.approve(id);
    const promiseData = firstValueFrom(observable);

    promiseData.then(response => {
      this.toastrService.success(response.message || "Teklif onaylandı.", "Başarılı");
      if (successCallBack) successCallBack();
    }).catch(error => {
      console.error("Approve Error:", error);
      this.toastrService.error(error.error?.message || "Onaylama işlemi sırasında hata oluştu.", "Hata");
    });
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


    async getAllByStatus(status: string): Promise<OfferDto[]> {
    try {
      const observable = this.offerService.getAllByStatus(status);
      const response = await firstValueFrom(observable);
      return response.data;
    } catch (error) {
      console.error(`Offer List by Status (${status}) Error:`, error);
      return [];
    }
  }
  async addOffer(Offer: OfferDto, callBackfunction?: () => void) {
    const observable = await this.offerService.addOffer(Offer)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

  
   async generateOfferReport(offerDto:OfferDto){
    const observable = this.offerService.generateOfferReport(offerDto)
    return (await firstValueFrom(observable))
  }

  // async updateOffer(Offer: Offer, callBackfunction?: () => void) {
  //   const observable = await this.offerService.updateOffer(Offer)
  //   const promiseData = firstValueFrom(observable)
  //   promiseData.then(response => {
  //     this.toastrService.success(response.message)
  //     callBackfunction && callBackfunction()
  //   }).catch(error => {
  //     this.toastrService.error(error.error)
  //   })
  // }
  // async approve(id: string) {
  //   const observable = this.offerService.approve(id)
  //   return (await firstValueFrom(observable)).data
  // }
  // async reject(id: string, reason: string) {
  //   const observable = this.offerService.reject(id, reason)
  //   return (await firstValueFrom(observable)).data
  // }
}
