import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { Offer } from '../../models/offers/offer';
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class OfferService extends BizimNetHttpClientService {

  private _controller = "Offer";
  
    addOffer(Offer: Offer) {
      const observable = this.post<ResponseModel | Offer>({ controller: this._controller, action: "Add" }, Offer) as Observable<ResponseModel>
      return observable
    }
  
    updateOffer(Offer: Offer) {
      const observable = this.post<ResponseModel | Offer>({ controller: this._controller, action: "Update" }, Offer) as Observable<ResponseModel>
      return observable
    }
    async deleteOffer(id: string) {
      const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
      return observable
    }
    getAll() {
      return this.get<ListResponseModel<Offer>>({ controller: this._controller, action: "GetAllDetails" })
    }
    getById(id: string) {
      return this.get<SingleResponseModel<Offer>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
    }
    approve(id: string) {
      return this.get<SingleResponseModel<Offer>>({ controller: this._controller, action: "Approve", queryString: `id=${id}` })
    }
    reject(id: string,reason:string) {
      return this.get<SingleResponseModel<Offer>>({ controller: this._controller, action: "Reject", queryString: `id=${id}&reason=${reason}` })
    }
}
