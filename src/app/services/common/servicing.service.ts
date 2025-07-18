import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { Servicing } from '../../models/servicing/servicing';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ServicingService extends BizimNetHttpClientService {

  private _controller = "Servicing";

  addServicing(Servicing: Servicing) {
    const observable = this.post<ResponseModel | Servicing>({ controller: this._controller, action: "Add" }, Servicing) as Observable<ResponseModel>
    return observable
  }
  updateServicing(Servicing: Servicing) {
    const observable = this.post<ResponseModel | Servicing>({ controller: this._controller, action: "Update" }, Servicing) as Observable<ResponseModel>
    return observable
  }
  async deleteServicing(id: string) {
    const observable = this.delete<ResponseModel>({ controller: this._controller, action: "Delete" }, id)
    return observable
  }
  getAll() {
    return this.get<ListResponseModel<Servicing>>({ controller: this._controller, action: "GetAll" })
  }
  markAsCompleted(id: string) {
    return this.get<SingleResponseModel<Servicing>>({ controller: this._controller, action: "MarkAsCompleted", queryString: `id=${id}` })
  }
  markAsInProgress(id: string) {
    return this.get<SingleResponseModel<Servicing>>({ controller: this._controller, action: "MarkAsInProgress", queryString: `id=${id}` })
  }
  getById(id: string) {
    return this.get<SingleResponseModel<Servicing>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
  }
}
