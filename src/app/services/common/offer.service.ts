import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { OfferDto } from '../../models/offers/offer';
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class OfferService extends BizimNetHttpClientService {

  private _controller = "Offer";

  addOffer(Offer: OfferDto) {
    const observable = this.post<ResponseModel | OfferDto>({ controller: this._controller, action: "Add" }, Offer) as Observable<ResponseModel>
    return observable
  }

  async deleteOffer(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }
  getAll() {
    return this.get<ListResponseModel<OfferDto>>({ controller: this._controller, action: "GetAllDetails" })
  }
  getAllByStatus(status: string) {
    return this.get<ListResponseModel<OfferDto>>({ controller: this._controller, action: "GetByStatus", queryString: `status=${status}` })
  }
  approve(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Approve", queryString: `id=${id}` })
    return observable
  }

  generateOfferReport(offerDto: OfferDto) {
    const observable = this.post<ResponseModel | OfferDto>({ controller: this._controller, action: "GenerateOfferReport" }, offerDto) as Observable<ResponseModel>
    return observable
  }

}
